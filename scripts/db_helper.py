import os
import re

def clean_dsn_for_psycopg2(url: str) -> str:
    """Strip parameters like ?schema=public which psycopg2/libpq does not support."""
    if not url:
        return url
    # Remove ?schema=... or &schema=...
    cleaned = re.sub(r'\?schema=[^&]*&?', '?', url)
    cleaned = re.sub(r'&schema=[^&]*', '', cleaned)
    cleaned = re.sub(r'\?$', '', cleaned)
    return cleaned

def get_database_url() -> str:
    """
    Retrieve database URL from environment variable or local .env file.
    Throws ValueError if neither DATABASE_URL nor DB_PASSWORD is provided.
    """
    # 1. Check DATABASE_URL environment variable
    url = os.environ.get('DATABASE_URL')
    if url:
        return clean_dsn_for_psycopg2(url)
        
    # 2. Check DB_PASSWORD environment variable
    db_pass = os.environ.get('DB_PASSWORD')
    if db_pass:
        return f'postgresql://postgres:{db_pass}@localhost:5432/linguaflow_db'
        
    # 3. Fallback to .env in repository root (local developer convenience)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(script_dir)
    env_file = os.path.join(repo_root, '.env')
    if os.path.exists(env_file):
        with open(env_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line.startswith('DATABASE_URL=') and not line.startswith('#'):
                    val = line.split('=', 1)[1].strip().strip('"').strip("'")
                    if val:
                        return clean_dsn_for_psycopg2(val)

    # 4. Strict failure if no environment credential is set
    raise ValueError(
        "DATABASE_URL or DB_PASSWORD environment variable is required but not set. "
        "Please export DATABASE_URL or set DB_PASSWORD in your environment."
    )
