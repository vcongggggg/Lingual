import os
import sys
import re
import secrets
import psycopg2
from psycopg2 import sql
from urllib.parse import urlparse, quote_plus

sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_ENV = os.path.join(REPO_ROOT, '.env')
API_ENV = os.path.join(REPO_ROOT, 'apps', 'api', '.env')

def parse_db_url(url_str):
    url_str = url_str.strip().strip('"').strip("'")
    # Clean query params for urlparse
    parsed = urlparse(url_str)
    user = parsed.username or 'postgres'
    password = parsed.password or ''
    host = parsed.hostname or 'localhost'
    port = parsed.port or 5432
    dbname = parsed.path.lstrip('/') or 'linguaflow_db'
    return {
        'user': user,
        'password': password,
        'host': host,
        'port': port,
        'dbname': dbname
    }

def update_env_file(filepath, new_url, new_password):
    if not os.path.exists(filepath):
        print(f"    [-] File not found to update: {filepath}")
        return False
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    lines = content.splitlines()
    new_lines = []
    has_db_url = False
    has_db_pass = False
    
    for line in lines:
        if line.startswith('DATABASE_URL='):
            new_lines.append(f'DATABASE_URL="{new_url}"')
            has_db_url = True
        elif line.startswith('POSTGRES_PASSWORD='):
            new_lines.append(f'POSTGRES_PASSWORD="{new_password}"')
            has_db_pass = True
        else:
            new_lines.append(line)
            
    if not has_db_url:
        new_lines.append(f'DATABASE_URL="{new_url}"')
    if 'POSTGRES_PASSWORD' in content and not has_db_pass:
        new_lines.append(f'POSTGRES_PASSWORD="{new_password}"')
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines) + '\n')
        
    print(f"    [+] Updated: {os.path.relpath(filepath, REPO_ROOT)}")
    return True

def main():
    print("=== [POSTGRESQL PASSWORD ROTATION PIPELINE] ===")
    
    # 1. Read current environment configuration
    if not os.path.exists(ROOT_ENV):
        raise FileNotFoundError(f"Root .env file not found: {ROOT_ENV}")
        
    current_url = None
    with open(ROOT_ENV, 'r', encoding='utf-8') as f:
        for line in f:
            if line.startswith('DATABASE_URL=') and not line.startswith('#'):
                current_url = line.split('=', 1)[1].strip().strip('"').strip("'")
                break
                
    if not current_url:
        raise ValueError("Could not find DATABASE_URL in root .env")
        
    db_info = parse_db_url(current_url)
    user = db_info['user']
    old_password = db_info['password']
    host = db_info['host']
    port = db_info['port']
    dbname = db_info['dbname']
    
    print(f"[1] Target DB: {dbname} on {host}:{port} with user: '{user}'")
    
    # 2. Generate strong cryptographic password (>= 24 chars, URL safe)
    new_password = secrets.token_urlsafe(24) # 32 URL-safe characters
    print(f"[2] Generated new strong cryptographic password: length={len(new_password)} chars (URL-safe)")
    
    # 3. Connect using current credentials and execute ALTER USER
    print(f"[3] Connecting to PostgreSQL using current credentials...")
    try:
        conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=old_password,
            host=host,
            port=port
        )
        conn.autocommit = True
        cur = conn.cursor()
        
        # Alter user password
        cur.execute(sql.SQL("ALTER USER {} WITH PASSWORD %s").format(sql.Identifier(user)), (new_password,))
        print("    [+] SQL 'ALTER USER <user> WITH PASSWORD ...' executed successfully!")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"    [-] ERROR executing ALTER USER: {e}")
        raise e

    # 4. Update all local .env files
    print(f"\n[4] Updating local .env files...")
    new_db_url = f"postgresql://{user}:{new_password}@{host}:{port}/{dbname}?schema=public"
    update_env_file(ROOT_ENV, new_db_url, new_password)
    update_env_file(API_ENV, new_db_url, new_password)
    
    # 5. Verification tests
    print(f"\n[5] Verifying credential states:")
    
    # a) Test with NEW password
    try:
        conn_new = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=new_password,
            host=host,
            port=port
        )
        cur_new = conn_new.cursor()
        cur_new.execute("SELECT 1")
        cur_new.close()
        conn_new.close()
        print("    [a] Connect with NEW password: SUCCESS (Authentication OK)")
        new_login_ok = True
    except Exception as e:
        print(f"    [a] Connect with NEW password: FAILED ({e})")
        new_login_ok = False
        raise e
        
    # b) Test with OLD password
    try:
        conn_old = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=old_password,
            host=host,
            port=port
        )
        conn_old.close()
        print("    [b] Connect with OLD password: UNEXPECTED SUCCESS (Old password still works!)")
        old_login_failed = False
    except Exception:
        print("    [b] Connect with OLD password: FAILED AS EXPECTED (Old password successfully invalidated!)")
        old_login_failed = True
        
    if not (new_login_ok and old_login_failed):
        raise RuntimeError("Credential verification failed: new login must succeed and old login must fail!")
        
    print("\n>>> PASSWORD ROTATION IN DATABASE ENGINE COMPLETED SUCCESSFULLY! <<<")
    return {
        'new_login_ok': new_login_ok,
        'old_login_failed': old_login_failed
    }

if __name__ == '__main__':
    main()
