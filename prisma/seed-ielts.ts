import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export const SEED_IELTS_TRACKS = [
  {
    targetBand: 5.5,
    type: 'academic',
    description: 'Chặng 1: Nền tảng IELTS Band 4.5 - 5.5 (Củng cố từ vựng lõi Academic & kỹ năng làm bài cơ bản)',
  },
  {
    targetBand: 6.5,
    type: 'academic',
    description: 'Chặng 2: Bứt phá IELTS Band 6.0 - 6.5 (Tập trung chiến thuật làm bài Reading 2 cột & Listening)',
  },
  {
    targetBand: 7.5,
    type: 'academic',
    description: 'Chặng 3: Làm chủ IELTS Band 7.0+ (Luyện đề Mock Test thời gian thực & AI Writing Task 1/2 Evaluator)',
  },
];

export const SEED_IELTS_QUESTIONS = [
  // ==========================================================================
  // 1. ACADEMIC READING TEST (FULL 40 QUESTIONS ACROSS 3 PASSAGES)
  // ==========================================================================
  {
    id: 'ielts-reading-p1',
    title: 'Passage 1: The Engineering Marvel of Roman Aqueducts',
    skill: 'reading',
    type: 'academic',
    part: 'passage_1',
    targetBand: 6.0,
    passageText: `Roman aqueducts stand among the most impressive engineering achievements of the ancient world. Over a span of roughly 500 years, the Romans constructed hundreds of aqueduct systems across Europe, North Africa, and the Near East, supplying cities with millions of liters of fresh water daily.\n\nThe earliest aqueduct serving Rome was the Aqua Appia, built in 312 BC by censor Appius Claudius Caecus. As Rome's population expanded to over one million inhabitants, ten additional aqueduct lines were erected. The water supported public baths (thermae), latrines, fountains, private households, and industrial facilities such as grain mills.\n\nA common misconception is that aqueducts were primarily above-ground arched stone bridges. In reality, less than 20% of their total length consisted of elevated arches. The vast majority of water conduits were buried beneath the soil. This subterranean design protected the water supply from contamination, reduced evaporation, and prevented sabotage by foreign invaders during wartime.\n\nThe hydraulic engineering behind aqueducts relied entirely on gravity. Roman engineers (aquarii) surveyed the terrain using specialized leveling instruments such as the chorobates—a wooden bench equipped with water levels and plumb bobs. By maintaining an exceedingly gentle gradient (frequently as low as 1 in 5,000, or a drop of only 20 centimeters per kilometer), they ensured a steady, continuous flow without excessive water velocity that could erode the masonry lining.\n\nWater flowed through channels lined with waterproof pozzolanic concrete (opus caementicium mixed with volcanic ash). Sedimentation basins (piscinae limariae) were incorporated at regular intervals along the route to filter out dirt and debris before the clean water entered the urban castellum aquae (distribution tank). From there, lead and terracotta pipes distributed water throughout the city based on tiered water rights.`,
    content: JSON.stringify({
      questions: [
        {
          id: 'r_p1_q1',
          type: 'tfng',
          prompt: 'The Aqua Appia was the first aqueduct constructed to supply water to Rome.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'True',
          explanation: 'The text states: "The earliest aqueduct serving Rome was the Aqua Appia, built in 312 BC".',
        },
        {
          id: 'r_p1_q2',
          type: 'tfng',
          prompt: 'Most of the Roman aqueduct network consisted of arched stone bridges above ground.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'False',
          explanation: 'The text states: "less than 20% of their total length consisted of elevated arches. The vast majority of water conduits were buried beneath the soil".',
        },
        {
          id: 'r_p1_q3',
          type: 'tfng',
          prompt: 'Underground pipes helped prevent military enemies from poisoning or cutting off the water supply.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'True',
          explanation: 'The text notes subterranean conduits "prevented sabotage by foreign invaders during wartime".',
        },
        {
          id: 'r_p1_q4',
          type: 'tfng',
          prompt: 'Roman citizens had to pay an identical annual tax regardless of how much water they consumed.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'Not Given',
          explanation: 'The text mentions distribution based on tiered water rights, but does not provide information about an identical annual tax.',
        },
        {
          id: 'r_p1_q5',
          type: 'multiple_choice',
          prompt: 'Which instrument did Roman surveyors use to establish precise gradients for water flow?',
          options: ['The astrolabe', 'The chorobates', 'The sextant', 'The sundial'],
          correctAnswer: 'The chorobates',
          explanation: 'Paragraph 4 states: "surveyed the terrain using specialized leveling instruments such as the chorobates".',
        },
        {
          id: 'r_p1_q6',
          type: 'multiple_choice',
          prompt: 'Why was a very gentle gradient critical in the construction of aqueducts?',
          options: [
            'To allow boats to navigate the water channels',
            'To ensure steady flow without eroding masonry linings',
            'To warm the water through friction during transit',
            'To speed up transit during emergency droughts',
          ],
          correctAnswer: 'To ensure steady flow without eroding masonry linings',
          explanation: 'The text says maintaining a gentle gradient ensured steady flow without excessive velocity that could erode masonry.',
        },
        {
          id: 'r_p1_q7',
          type: 'multiple_choice',
          prompt: 'What was the function of sedimentation basins (piscinae limariae)?',
          options: [
            'To filter out dirt and suspended debris',
            'To store surplus water for agricultural irrigation',
            'To test the toxicity of the water on fish',
            'To measure the volume of water used by private houses',
          ],
          correctAnswer: 'To filter out dirt and suspended debris',
          explanation: 'The text specifies sedimentation basins filtered out dirt and debris before clean water entered the distribution tank.',
        },
        {
          id: 'r_p1_q8',
          type: 'sentence_completion',
          prompt: 'The concrete used to line the channels was made waterproof by adding ________.',
          options: ['volcanic ash', 'crushed seashells', 'granite powder', 'molten lead'],
          correctAnswer: 'volcanic ash',
          explanation: 'Paragraph 5 mentions "waterproof pozzolanic concrete (opus caementicium mixed with volcanic ash)".',
        },
        {
          id: 'r_p1_q9',
          type: 'sentence_completion',
          prompt: 'Urban water distribution was managed from a central holding structure called a ________.',
          options: ['castellum aquae', 'thermae', 'chorobates', 'piscina limaria'],
          correctAnswer: 'castellum aquae',
          explanation: 'Clean water entered the urban castellum aquae (distribution tank).',
        },
        {
          id: 'r_p1_q10',
          type: 'multiple_choice',
          prompt: 'How many total aqueduct lines served the city of Rome as its population peaked?',
          options: ['1', '5', '11', '25'],
          correctAnswer: '11',
          explanation: 'Paragraph 2 notes the earliest was Aqua Appia, and "ten additional aqueduct lines were erected" (1 + 10 = 11).',
        },
        {
          id: 'r_p1_q11',
          type: 'tfng',
          prompt: 'Pozzolanic concrete loses its durability when submerged in water.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'False',
          explanation: 'Pozzolanic concrete was specifically used because it was waterproof and set under water.',
        },
        {
          id: 'r_p1_q12',
          type: 'multiple_choice',
          prompt: 'What drove the movement of water throughout the entire aqueduct system?',
          options: ['Steam-powered pumps', 'Animal-driven water wheels', 'Gravity', 'Windmills'],
          correctAnswer: 'Gravity',
          explanation: 'Paragraph 4 states: "The hydraulic engineering behind aqueducts relied entirely on gravity."',
        },
        {
          id: 'r_p1_q13',
          type: 'tfng',
          prompt: 'Roman water conduits carried water only for private homes of patricians.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'False',
          explanation: 'Water supported public baths, latrines, fountains, private households, and industrial facilities.',
        },
      ],
    }),
  },

  {
    id: 'ielts-reading-p2',
    title: 'Passage 2: Neuroplasticity and the Science of Adult Language Acquisition',
    skill: 'reading',
    type: 'academic',
    part: 'passage_2',
    targetBand: 6.5,
    passageText: `For much of the twentieth century, neuroscientists adhered to the doctrine that the adult human brain was structurally immutable. It was widely believed that after a critical developmental window in early childhood, neurogenesis ceased and synaptic connections became permanently fixed. Under this paradigm, adults attempting to acquire a foreign language were deemed neurologically handicapped compared to young children.\n\nHowever, the emergence of modern neuroimaging technologies, particularly functional Magnetic Resonance Imaging (fMRI) and diffusion tensor imaging, has completely overturned this static model. We now recognize that the human brain possesses extraordinary neuroplasticity—the innate capacity to structurally reorganize itself by forming new neural pathways in response to novel cognitive demands.\n\nWhen adults engage in intensive second language acquisition, measurable anatomical changes occur in several key cortical regions. Research conducted at Lund University demonstrated that adult learners undergoing rigorous language immersion exhibited significant increases in the volume of the hippocampus and specific areas of the cerebral cortex compared to a control group studying cognitive subjects unrelated to languages. The hippocampus, crucial for memory consolidation, actively expands as lexical items and syntactic rules are internalized.\n\nMoreover, the structural integrity of the arcuate fasciculus—a prominent white-matter tract connecting Broca's area (speech production) and Wernicke's area (language comprehension)—shows elevated myelination in bilingual adults. Myelin, the protective lipid sheath encasing neuronal axons, facilitates faster transmission of electrical signals, accelerating lexical retrieval and phonological processing.\n\nWhile adults may rarely achieve a native-like phonological accent due to reduced flexibility in the motor cortex controlling vocal articulation, they possess notable cognitive advantages over children in other domains. Adults command superior metacognitive awareness, explicit grammatical reasoning capabilities, and extensive conceptual vocabularies from their native tongue. Consequently, through deliberate practice and spaced repetition, adult learners can attain remarkable degrees of bilingual proficiency.`,
    content: JSON.stringify({
      questions: [
        {
          id: 'r_p2_q14',
          type: 'tfng',
          prompt: 'Twentieth-century neuroscientists believed that the adult brain could readily grow new neurons.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'False',
          explanation: 'Paragraph 1 states it was believed that "neurogenesis ceased and synaptic connections became permanently fixed".',
        },
        {
          id: 'r_p2_q15',
          type: 'tfng',
          prompt: 'Neuroimaging technologies like fMRI provided empirical evidence supporting brain plasticity.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'True',
          explanation: 'Paragraph 2 notes fMRI "completely overturned this static model" by demonstrating neuroplasticity.',
        },
        {
          id: 'r_p2_q16',
          type: 'multiple_choice',
          prompt: 'What anatomical change was observed in adult language learners at Lund University?',
          options: [
            'A shrinkage of the prefrontal cortex',
            'Significant volume increases in the hippocampus and cerebral cortex',
            'A total loss of native language vocabulary',
            'Degradation of auditory pathways',
          ],
          correctAnswer: 'Significant volume increases in the hippocampus and cerebral cortex',
          explanation: 'Paragraph 3 mentions "significant increases in the volume of the hippocampus and specific areas of the cerebral cortex".',
        },
        {
          id: 'r_p2_q17',
          type: 'multiple_choice',
          prompt: 'What is the primary role of the arcuate fasciculus?',
          options: [
            'Regulating heart rate during public speaking',
            'Connecting speech production and language comprehension regions',
            'Filtering foreign phonemes in the inner ear',
            'Storing photographic memories of printed text',
          ],
          correctAnswer: 'Connecting speech production and language comprehension regions',
          explanation: 'Paragraph 4 defines it as "a prominent white-matter tract connecting Broca\'s area (speech production) and Wernicke\'s area (language comprehension)".',
        },
        {
          id: 'r_p2_q18',
          type: 'sentence_completion',
          prompt: 'The lipid substance that wraps around nerve axons to accelerate signal transmission is ________.',
          options: ['myelin', 'pozzolana', 'dopamine', 'synapse'],
          correctAnswer: 'myelin',
          explanation: 'Paragraph 4 states: "Myelin, the protective lipid sheath encasing neuronal axons, facilitates faster transmission".',
        },
        {
          id: 'r_p2_q19',
          type: 'multiple_choice',
          prompt: 'According to the passage, why do adult learners frequently struggle to acquire a native-like accent?',
          options: [
            'They lack interest in cultural immersion',
            'Decreased motor cortex flexibility governing vocal articulation',
            'Damage caused by fMRI scans',
            'Reduced size of their hippocampus',
          ],
          correctAnswer: 'Decreased motor cortex flexibility governing vocal articulation',
          explanation: 'Paragraph 5 mentions "reduced flexibility in the motor cortex controlling vocal articulation".',
        },
        {
          id: 'r_p2_q20',
          type: 'tfng',
          prompt: 'Young children have stronger explicit grammatical reasoning skills than adult learners.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'False',
          explanation: 'Paragraph 5 emphasizes that adults "command superior metacognitive awareness, explicit grammatical reasoning capabilities".',
        },
        {
          id: 'r_p2_q21',
          type: 'tfng',
          prompt: 'Spaced repetition is cited as a technique that helps adult learners attain proficiency.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'True',
          explanation: 'Paragraph 5 affirms that "through deliberate practice and spaced repetition, adult learners can attain remarkable degrees of bilingual proficiency".',
        },
        {
          id: 'r_p2_q22',
          type: 'multiple_choice',
          prompt: 'Which brain region is directly associated with speech production?',
          options: ['Broca\'s area', 'Wernicke\'s area', 'Occipital lobe', 'Cerebellum'],
          correctAnswer: 'Broca\'s area',
          explanation: 'Paragraph 4 specifies "Broca\'s area (speech production)".',
        },
        {
          id: 'r_p2_q23',
          type: 'multiple_choice',
          prompt: 'What does the term "neuroplasticity" denote?',
          options: [
            'The irreversible decay of brain tissue with aging',
            'The brain\'s ability to reorganize itself by forming new pathways',
            'The surgical implantation of synthetic memory chips',
            'The chemical process that produces myelin',
          ],
          correctAnswer: 'The brain\'s ability to reorganize itself by forming new pathways',
          explanation: 'Paragraph 2 defines it as "the innate capacity to structurally reorganize itself by forming new neural pathways".',
        },
        {
          id: 'r_p2_q24',
          type: 'tfng',
          prompt: 'Students in the Lund University control group were studying advanced Russian grammar.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'False',
          explanation: 'The control group studied "cognitive subjects unrelated to languages".',
        },
        {
          id: 'r_p2_q25',
          type: 'sentence_completion',
          prompt: 'The brain structure responsible for memory consolidation discussed in the text is the ________.',
          options: ['hippocampus', 'amygdala', 'corpus callosum', 'thalamus'],
          correctAnswer: 'hippocampus',
          explanation: 'The text notes: "The hippocampus, crucial for memory consolidation, actively expands".',
        },
        {
          id: 'r_p2_q26',
          type: 'tfng',
          prompt: 'Bilingual adults exhibit higher levels of myelination in the arcuate fasciculus.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'True',
          explanation: 'Paragraph 4 states the arcuate fasciculus "shows elevated myelination in bilingual adults".',
        },
      ],
    }),
  },

  {
    id: 'ielts-reading-p3',
    title: 'Passage 3: Artificial Intelligence, Automation, and the Future of Labor Economics',
    skill: 'reading',
    type: 'academic',
    part: 'passage_3',
    targetBand: 7.5,
    passageText: `The pervasive integration of artificial intelligence (AI), generative machine learning models, and robotic automation into the global economy has ignited intense debate among economists, sociologists, and policymakers. Historical precedents such as the First Industrial Revolution demonstrate that technological disruptions initially displace specific labor categories while generating novel, unanticipated employment sectors. However, modern theorists debate whether the velocity, cognitive depth, and breadth of the current digital revolution distinguish it fundamentally from previous epochs.\n\nIn conventional economic theory, technological progress exhibits two counteracting forces: the 'displacement effect' and the 'productivity effect'. The displacement effect occurs when capital equipment directly substitutes for human labor in tasks that can be algorithmic or mechanized. Conversely, the productivity effect arises when automation lowers production costs, expands aggregate market demand, and fosters entirely new industries requiring human ingenuity, oversight, and empathy.\n\nHistorically, automation predominantly affected routine manual tasks on assembly lines. Today, advanced neural networks and large language models (LLMs) threaten cognitive and creative labor—disciplines previously deemed the exclusive preserve of human intellect. Legal analysis, financial modeling, medical diagnostic screening, and software coding are increasingly performed with parity or superiority by synthetic intelligence.\n\nEconomist David Autor highlights that employment polarization—the "hollowing out" of middle-skill jobs—is intensifying. High-skill abstract occupations (requiring complex problem solving and emotional intelligence) and low-skill manual jobs (requiring physical agility in unpredictable environments, such as caregiving or plumbing) have grown, while middle-income clerical and administrative roles have plummeted.\n\nTo mitigate socioeconomic disruption, institutional economists advocate multifaceted policy interventions: universal lifelong education subsidies, portable worker benefits suited to decentralized gig economies, and revised taxation frameworks on autonomous capital investments. Rather than resisting automation through futile neo-Luddite measures, societies must cultivate uniquely human competencies: ethical discernment, critical questioning, and creative synthesis.`,
    content: JSON.stringify({
      questions: [
        {
          id: 'r_p3_q27',
          type: 'tfng',
          prompt: 'The First Industrial Revolution only created unemployment without establishing any new job sectors.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'False',
          explanation: 'Paragraph 1 states historical precedents initially displaced labor "while generating novel, unanticipated employment sectors".',
        },
        {
          id: 'r_p3_q28',
          type: 'tfng',
          prompt: 'The displacement effect describes machines replacing human workers in algorithmic tasks.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'True',
          explanation: 'Paragraph 2 explains the displacement effect occurs when capital equipment directly substitutes for human labor.',
        },
        {
          id: 'r_p3_q29',
          type: 'multiple_choice',
          prompt: 'How does the productivity effect theoretically benefit employment?',
          options: [
            'By eliminating all corporate taxes',
            'By lowering production costs, increasing demand, and spawning new industries',
            'By legally prohibiting imports from foreign automated factories',
            'By capping the salaries of senior software engineers',
          ],
          correctAnswer: 'By lowering production costs, increasing demand, and spawning new industries',
          explanation: 'Paragraph 2 notes it lowers production costs, expands aggregate demand, and fosters new industries.',
        },
        {
          id: 'r_p3_q30',
          type: 'multiple_choice',
          prompt: 'How does modern AI automation differ from nineteenth-century industrial automation?',
          options: [
            'Modern AI only operates during daytime hours',
            'Modern AI impacts high-level cognitive and creative labor rather than just routine manual tasks',
            'Modern AI has had zero impact on corporate revenues',
            'Modern AI requires more coal power than steam engines',
          ],
          correctAnswer: 'Modern AI impacts high-level cognitive and creative labor rather than just routine manual tasks',
          explanation: 'Paragraph 3 notes neural networks threaten cognitive and creative labor, unlike early automation which affected routine manual tasks.',
        },
        {
          id: 'r_p3_q31',
          type: 'sentence_completion',
          prompt: 'The phenomenon where middle-income clerical jobs decline while high- and low-skill jobs grow is called employment ________.',
          options: ['polarization', 'stagnation', 'equilibration', 'dislocation'],
          correctAnswer: 'polarization',
          explanation: 'Paragraph 4 states: "David Autor highlights that employment polarization—the "hollowing out" of middle-skill jobs—is intensifying".',
        },
        {
          id: 'r_p3_q32',
          type: 'multiple_choice',
          prompt: 'Which role is cited as being resilient to automation due to requiring physical agility in unpredictable environments?',
          options: ['Plumbing', 'Financial auditing', 'Basic legal document review', 'Telephone telemarketing'],
          correctAnswer: 'Plumbing',
          explanation: 'Paragraph 4 lists plumbing and caregiving as examples of low-skill manual jobs requiring physical agility in unpredictable environments.',
        },
        {
          id: 'r_p3_q33',
          type: 'tfng',
          prompt: 'Economists recommend completely outlawing autonomous software in healthcare diagnostics.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'False',
          explanation: 'The text advises against futile neo-Luddite resistance and recommends policy reforms and human skills cultivation.',
        },
        {
          id: 'r_p3_q34',
          type: 'multiple_choice',
          prompt: 'What policy intervention is suggested for gig economy workers?',
          options: ['Portable worker benefits', 'Mandatory overtime hours', 'Strict relocation to factories', 'Fixed wage ceilings'],
          correctAnswer: 'Portable worker benefits',
          explanation: 'Paragraph 5 suggests "portable worker benefits suited to decentralized gig economies".',
        },
        {
          id: 'r_p3_q35',
          type: 'sentence_completion',
          prompt: 'Opponents of technological change who attempt to destroy or ban new machines are termed ________.',
          options: ['neo-Luddites', 'aquarii', 'empiricists', 'theorists'],
          correctAnswer: 'neo-Luddites',
          explanation: 'Paragraph 5 warns against "futile neo-Luddite measures".',
        },
        {
          id: 'r_p3_q36',
          type: 'tfng',
          prompt: 'Large Language Models are unable to write functional computer code.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'False',
          explanation: 'Paragraph 3 states legal analysis, financial modeling, and software coding are performed with parity or superiority by AI.',
        },
        {
          id: 'r_p3_q37',
          type: 'multiple_choice',
          prompt: 'Which human competency is specifically emphasized for the automated future?',
          options: ['Ethical discernment and critical questioning', 'Typing speed', 'Mental arithmetic without calculators', 'Handwriting calligraphy'],
          correctAnswer: 'Ethical discernment and critical questioning',
          explanation: 'Paragraph 5 states societies must cultivate "ethical discernment, critical questioning, and creative synthesis".',
        },
        {
          id: 'r_p3_q38',
          type: 'tfng',
          prompt: 'David Autor is an economist noted for his research on employment polarization.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'True',
          explanation: 'Paragraph 4 mentions "Economist David Autor highlights that employment polarization... is intensifying".',
        },
        {
          id: 'r_p3_q39',
          type: 'tfng',
          prompt: 'All governments have agreed to enact an identical global tax on robot manufacturers.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'Not Given',
          explanation: 'The text notes economists advocate revised taxation frameworks, but does not claim all governments agreed on an identical global tax.',
        },
        {
          id: 'r_p3_q40',
          type: 'multiple_choice',
          prompt: 'What is the overall tone and stance of the author regarding AI and the future of work?',
          options: [
            'Analytical and proactive, emphasizing adaptation and institutional reform',
            'Pessimistic, demanding an immediate freeze on computer engineering',
            'Indifferent, claiming technology has no economic consequences',
            'Purely nostalgic for pre-industrial agricultural society',
          ],
          correctAnswer: 'Analytical and proactive, emphasizing adaptation and institutional reform',
          explanation: 'The author objectively analyzes challenges and proposes actionable educational and fiscal policies.',
        },
      ],
    }),
  },

  // ==========================================================================
  // 2. LISTENING TEST (FULL 40 QUESTIONS ACROSS 4 SECTIONS)
  // ==========================================================================
  {
    id: 'ielts-listening-s1',
    title: 'Section 1: Student Accommodation and Housing Application',
    skill: 'listening',
    type: 'academic',
    part: 'section_1',
    targetBand: 5.5,
    audioUrl: 'https://cdn.freesound.org/previews/567/567341_5674468-lq.mp3',
    content: JSON.stringify({
      transcript: `Agent: Good morning! Welcome to the City Central University Student Housing Office. How can I assist you today?\nStudent: Good morning. My name is Daniel Chen. I'm starting my postgraduate degree in Biotechnology next month, and I need to register for university-approved housing.\nAgent: Excellent, Daniel. Let me pull up our intake form. First, could you confirm your contact phone number and student ID?\nStudent: Certainly. My student ID is BT-90421, and my mobile number is 07700-900452.\nAgent: Perfect. Now, what type of accommodation are you seeking? We offer shared apartments with private en-suite bedrooms, traditional dormitory halls with shared bathrooms, or independent studio apartments.\nStudent: I prefer a private en-suite bedroom in a shared flat. I'd like to cook for myself, so a shared kitchen is fine, but I need a quiet desk space for studying.\nAgent: We have great availability at Victoria Hall and Riverside Lodge. Victoria Hall is just 500 meters from the Science Faculty, while Riverside Lodge is about 2 kilometers away on the tram line. What is your weekly budget ceiling?\nStudent: My maximum weekly budget is 180 pounds, including utilities like water, heating, and Wi-Fi.\nAgent: Victoria Hall en-suite rooms are 175 pounds per week, all inclusive! That fits neatly within your budget. Rooms come with high-speed fiber internet, an orthopaedic mattress, and free access to the on-site gymnasium.\nStudent: That sounds ideal. When would the tenancy contract begin, and what deposit is required?\nAgent: The standard academic lease begins on September 18th and lasts 44 weeks. The refundable security deposit is 350 pounds, payable upon signing.`,
      questions: [
        {
          id: 'l_s1_q1',
          type: 'multiple_choice',
          prompt: 'What subject is Daniel going to study at the university?',
          options: ['Biotechnology', 'Civil Engineering', 'Computer Science', 'Business Administration'],
          correctAnswer: 'Biotechnology',
          explanation: 'Daniel says: "I\'m starting my postgraduate degree in Biotechnology next month".',
        },
        {
          id: 'l_s1_q2',
          type: 'multiple_choice',
          prompt: 'What is Daniel\'s student ID number?',
          options: ['BT-90421', 'BT-90214', 'BC-90421', 'BT-94021'],
          correctAnswer: 'BT-90421',
          explanation: 'Daniel says: "My student ID is BT-90421".',
        },
        {
          id: 'l_s1_q3',
          type: 'multiple_choice',
          prompt: 'Which accommodation type did Daniel choose?',
          options: [
            'Private en-suite bedroom in a shared flat',
            'Independent private studio',
            'Traditional dormitory with shared bathroom',
            'Homestay with a local family',
          ],
          correctAnswer: 'Private en-suite bedroom in a shared flat',
          explanation: 'Daniel states: "I prefer a private en-suite bedroom in a shared flat".',
        },
        {
          id: 'l_s1_q4',
          type: 'multiple_choice',
          prompt: 'What is Daniel\'s maximum weekly budget ceiling?',
          options: ['£150', '£175', '£180', '£200'],
          correctAnswer: '£180',
          explanation: 'Daniel states: "My maximum weekly budget is 180 pounds".',
        },
        {
          id: 'l_s1_q5',
          type: 'multiple_choice',
          prompt: 'Which residence did the housing officer recommend based on proximity to the Science Faculty?',
          options: ['Victoria Hall', 'Riverside Lodge', 'Queen\'s Court', 'Parkside Commons'],
          correctAnswer: 'Victoria Hall',
          explanation: 'The agent says: "Victoria Hall is just 500 meters from the Science Faculty".',
        },
        {
          id: 'l_s1_q6',
          type: 'multiple_choice',
          prompt: 'How much is the weekly rent at Victoria Hall?',
          options: ['£160', '£175', '£180', '£195'],
          correctAnswer: '£175',
          explanation: 'The agent states: "Victoria Hall en-suite rooms are 175 pounds per week, all inclusive!"',
        },
        {
          id: 'l_s1_q7',
          type: 'multiple_choice',
          prompt: 'Which facility is included for free at Victoria Hall?',
          options: ['On-site gymnasium', 'Underground car parking', 'Daily catered breakfast', 'Laundry dry-cleaning service'],
          correctAnswer: 'On-site gymnasium',
          explanation: 'The agent lists "free access to the on-site gymnasium".',
        },
        {
          id: 'l_s1_q8',
          type: 'multiple_choice',
          prompt: 'On which date does the tenancy contract commence?',
          options: ['September 1st', 'September 18th', 'October 1st', 'August 25th'],
          correctAnswer: 'September 18th',
          explanation: 'The agent specifies: "The standard academic lease begins on September 18th".',
        },
        {
          id: 'l_s1_q9',
          type: 'multiple_choice',
          prompt: 'How long is the standard tenancy contract duration?',
          options: ['30 weeks', '40 weeks', '44 weeks', '52 weeks'],
          correctAnswer: '44 weeks',
          explanation: 'The agent states the lease "lasts 44 weeks".',
        },
        {
          id: 'l_s1_q10',
          type: 'multiple_choice',
          prompt: 'How much is the refundable security deposit?',
          options: ['£200', '£300', '£350', '£500'],
          correctAnswer: '£350',
          explanation: 'The agent states: "The refundable security deposit is 350 pounds".',
        },
      ],
    }),
  },

  {
    id: 'ielts-listening-s2',
    title: 'Section 2: City Heritage Museum Guided Walking Tour',
    skill: 'listening',
    type: 'academic',
    part: 'section_2',
    targetBand: 6.0,
    audioUrl: 'https://cdn.freesound.org/previews/567/567341_5674468-lq.mp3',
    content: JSON.stringify({
      transcript: `Guide: Good morning, ladies and gentlemen! Welcome to the St. Jude Maritime Heritage Museum. Before we embark on our 45-minute gallery tour, let me give you essential orientation information.\n\nOur museum was originally founded in 1884 as a working naval dry dock. Following an extensive restoration in 2018, the warehouse was converted into the interactive exhibition space you see today. To your immediate left is the Cloakroom, where you can safely deposit bulky backpacks, umbrellas, and coats free of charge. Directly opposite the cloakroom on your right is the Museum Gift Shop, featuring authentic maritime models and local artisan handicrafts.\n\nNow, let's look at the exhibition layout. The ground floor hosts the Age of Sail Gallery, showcasing nineteenth-century navigational chronometers, compasses, and ship rigging. Notice the full-scale replica of the schooner 'Windward' in the central atrium. You are invited to board the deck, but please note that high-heeled footwear is strictly prohibited on the wooden deck to protect the varnished timber.\n\nOn the second level, accessible via the glass elevators, you will find the Deep Sea Exploration Wing. Here, children and adults can pilot an underwater remote-operated vehicle (ROV) simulator through deep ocean canyons. Photography is permitted throughout all permanent collections; however, flash photography is prohibited in the Historical Manuscripts Vault because intense light degrades the antique parchment.\n\nFinally, if you wish to grab lunch, the Compass Rose Cafe is located on the rooftop terrace, offering panoramic harbor views and fresh local seafood. The cafe serves meals until 3:30 PM.`,
      questions: [
        {
          id: 'l_s2_q11',
          type: 'multiple_choice',
          prompt: 'In what year was the facility originally founded as a naval dry dock?',
          options: ['1884', '1918', '1984', '2018'],
          correctAnswer: '1884',
          explanation: 'The guide says: "Our museum was originally founded in 1884 as a working naval dry dock".',
        },
        {
          id: 'l_s2_q12',
          type: 'multiple_choice',
          prompt: 'Where can visitors store their backpacks and umbrellas?',
          options: ['In the rooftop cafe', 'In the Cloakroom to the immediate left', 'In the Gift Shop', 'In the vehicle simulator'],
          correctAnswer: 'In the Cloakroom to the immediate left',
          explanation: 'The guide says: "To your immediate left is the Cloakroom, where you can safely deposit bulky backpacks".',
        },
        {
          id: 'l_s2_q13',
          type: 'multiple_choice',
          prompt: 'What is situated directly opposite the cloakroom on the right?',
          options: ['The Museum Gift Shop', 'The ticket turnstiles', 'The restrooms', 'The emergency exit'],
          correctAnswer: 'The Museum Gift Shop',
          explanation: 'The guide notes: "Directly opposite the cloakroom on your right is the Museum Gift Shop".',
        },
        {
          id: 'l_s2_q14',
          type: 'multiple_choice',
          prompt: 'What is the name of the ship replica displayed in the central atrium?',
          options: ['The Endeavour', 'The Windward', 'The Victory', 'The Sea Sprite'],
          correctAnswer: 'The Windward',
          explanation: 'The guide mentions: "the full-scale replica of the schooner \'Windward\' in the central atrium".',
        },
        {
          id: 'l_s2_q15',
          type: 'multiple_choice',
          prompt: 'Why is high-heeled footwear prohibited on the ship\'s deck?',
          options: [
            'To protect the varnished timber',
            'Because it poses an electric shock hazard',
            'Because the stairs are too narrow',
            'To prevent noise disturbance',
          ],
          correctAnswer: 'To protect the varnished timber',
          explanation: 'The guide explains: "high-heeled footwear is strictly prohibited on the wooden deck to protect the varnished timber".',
        },
        {
          id: 'l_s2_q16',
          type: 'multiple_choice',
          prompt: 'What interactive exhibit is located in the Deep Sea Exploration Wing?',
          options: ['A submarine escape room', 'An underwater ROV simulator', 'A live shark touch pool', 'A tidal wave generator'],
          correctAnswer: 'An underwater ROV simulator',
          explanation: 'The guide highlights piloting "an underwater remote-operated vehicle (ROV) simulator".',
        },
        {
          id: 'l_s2_q17',
          type: 'multiple_choice',
          prompt: 'Where is flash photography strictly banned?',
          options: [
            'Throughout the entire building',
            'In the Historical Manuscripts Vault',
            'In the outdoor harbor area',
            'On the rooftop terrace',
          ],
          correctAnswer: 'In the Historical Manuscripts Vault',
          explanation: 'The guide states: "flash photography is prohibited in the Historical Manuscripts Vault because intense light degrades the antique parchment".',
        },
        {
          id: 'l_s2_q18',
          type: 'multiple_choice',
          prompt: 'Where is the Compass Rose Cafe located?',
          options: ['In the basement vault', 'On the ground floor', 'On the second floor', 'On the rooftop terrace'],
          correctAnswer: 'On the rooftop terrace',
          explanation: 'The guide mentions: "the Compass Rose Cafe is located on the rooftop terrace".',
        },
        {
          id: 'l_s2_q19',
          type: 'multiple_choice',
          prompt: 'At what time does the Compass Rose Cafe cease serving meals?',
          options: ['2:00 PM', '3:30 PM', '5:00 PM', '6:30 PM'],
          correctAnswer: '3:30 PM',
          explanation: 'The guide states: "The cafe serves meals until 3:30 PM".',
        },
        {
          id: 'l_s2_q20',
          type: 'multiple_choice',
          prompt: 'How long is the scheduled guided tour?',
          options: ['30 minutes', '45 minutes', '60 minutes', '90 minutes'],
          correctAnswer: '45 minutes',
          explanation: 'The guide introduces: "Before we embark on our 45-minute gallery tour".',
        },
      ],
    }),
  },

  {
    id: 'ielts-listening-s3',
    title: 'Section 3: Academic Tutorial on Marine Coral Bleaching Research',
    skill: 'listening',
    type: 'academic',
    part: 'section_3',
    targetBand: 6.5,
    audioUrl: 'https://cdn.freesound.org/previews/567/567341_5674468-lq.mp3',
    content: JSON.stringify({
      transcript: `Dr. Morrison: Come in, Liam and Maya. Take a seat. I received your preliminary dissertation proposal on thermal stress and coral bleaching in the Indo-Pacific reef systems. Overall, your literature review is thorough, but we need to sharpen your experimental methodology.\nMaya: Thank you, Dr. Morrison. We realized our original sampling area—covering fifteen dispersed atolls—was logistically unrealistic given our three-month field window.\nLiam: Exactly. So we decided to narrow our scope strictly to the coral reefs surrounding Heron Island in the Southern Great Barrier Reef. That will allow us to conduct daily water temperature sampling and photogrammetry surveys.\nDr. Morrison: That is a very sensible revision. Now, what specific physiological metrics will you track to measure the breakdown of the symbiotic relationship between the coral polyps and their endosymbionts?\nMaya: We plan to measure maximum photosynthetic efficiency using Pulse-Amplitude Modulated (PAM) fluorometry. It's non-invasive and provides instantaneous quantum yield data of photosystem II in the zooxanthellae.\nLiam: We will also take small tissue biopsies every fortnight to quantify chlorophyll-a concentration and zooxanthellae cell density per square centimeter under controlled laboratory spectrophotometry.\nDr. Morrison: Excellent choices. However, what control mechanisms will you introduce against seasonal tidal shifts and water turbidity?\nMaya: We are deploying automated autonomous loggers that record dissolved oxygen, salinity, and photosynthetically active radiation every fifteen minutes.\nDr. Morrison: Very good. Remember that your research ethics permit from the Marine Park Authority requires at least six weeks processing time, so submit that application by Friday.`,
      questions: [
        {
          id: 'l_s3_q21',
          type: 'multiple_choice',
          prompt: 'What was the primary weakness of Liam and Maya\'s initial research proposal?',
          options: [
            'They lacked any scientific references',
            'Their proposed sampling area was too geographically dispersed for a 3-month timeline',
            'They forgot to include Dr. Morrison as co-author',
            'Their budget was exceeded by 50,000 dollars',
          ],
          correctAnswer: 'Their proposed sampling area was too geographically dispersed for a 3-month timeline',
          explanation: 'Maya says: "our original sampling area—covering fifteen dispersed atolls—was logistically unrealistic given our three-month field window".',
        },
        {
          id: 'l_s3_q22',
          type: 'multiple_choice',
          prompt: 'Which specific geographic location did the students select for their revised fieldwork?',
          options: ['Heron Island', 'Bikini Atoll', 'Galapagos Islands', 'Okinawa Marine Reserve'],
          correctAnswer: 'Heron Island',
          explanation: 'Liam notes: "narrow our scope strictly to the coral reefs surrounding Heron Island".',
        },
        {
          id: 'l_s3_q23',
          type: 'multiple_choice',
          prompt: 'What apparatus will the students utilize for non-invasive photosynthetic efficiency measurement?',
          options: [
            'Pulse-Amplitude Modulated (PAM) fluorometry',
            'Gas chromatography mass spectrometry',
            'Digital satellite telemetry',
            'Acoustic Doppler current profilers',
          ],
          correctAnswer: 'Pulse-Amplitude Modulated (PAM) fluorometry',
          explanation: 'Maya states: "measure maximum photosynthetic efficiency using Pulse-Amplitude Modulated (PAM) fluorometry".',
        },
        {
          id: 'l_s3_q24',
          type: 'multiple_choice',
          prompt: 'How frequently will the researchers collect coral tissue biopsies?',
          options: ['Every 24 hours', 'Every fortnight (two weeks)', 'Once a month', 'At the end of three months only'],
          correctAnswer: 'Every fortnight (two weeks)',
          explanation: 'Liam says: "take small tissue biopsies every fortnight".',
        },
        {
          id: 'l_s3_q25',
          type: 'multiple_choice',
          prompt: 'What laboratory method will quantify chlorophyll-a and zooxanthellae density?',
          options: ['Controlled spectrophotometry', 'X-ray crystallography', 'Polymerase chain reaction', 'Paper chromatography'],
          correctAnswer: 'Controlled spectrophotometry',
          explanation: 'Liam specifies: "quantify chlorophyll-a concentration and zooxanthellae cell density... under controlled laboratory spectrophotometry".',
        },
        {
          id: 'l_s3_q26',
          type: 'multiple_choice',
          prompt: 'How often do the autonomous submerged loggers record environmental variables?',
          options: ['Every minute', 'Every 15 minutes', 'Every hour', 'Twice daily'],
          correctAnswer: 'Every 15 minutes',
          explanation: 'Maya says: "record dissolved oxygen, salinity, and photosynthetically active radiation every fifteen minutes".',
        },
        {
          id: 'l_s3_q27',
          type: 'multiple_choice',
          prompt: 'Which symbiotic organism lives inside the coral polyps?',
          options: ['Zooxanthellae', 'Cyanobacteria', 'Barnacles', 'Sea urchins'],
          correctAnswer: 'Zooxanthellae',
          explanation: 'Dr. Morrison and Maya discuss photosynthetic yield in the zooxanthellae.',
        },
        {
          id: 'l_s3_q28',
          type: 'multiple_choice',
          prompt: 'How much lead time is required to process the Marine Park Authority research ethics permit?',
          options: ['2 weeks', '4 weeks', '6 weeks', '12 weeks'],
          correctAnswer: '6 weeks',
          explanation: 'Dr. Morrison warns: "requires at least six weeks processing time".',
        },
        {
          id: 'l_s3_q29',
          type: 'multiple_choice',
          prompt: 'By which day of the week must the students submit their ethics application?',
          options: ['Wednesday', 'Thursday', 'Friday', 'Monday'],
          correctAnswer: 'Friday',
          explanation: 'Dr. Morrison instructs: "submit that application by Friday".',
        },
        {
          id: 'l_s3_q30',
          type: 'multiple_choice',
          prompt: 'What was Dr. Morrison\'s assessment of the students\' literature review?',
          options: ['Thorough and satisfactory', 'Completely inadequate', 'Outdated by twenty years', 'Lacking any peer-reviewed sources'],
          correctAnswer: 'Thorough and satisfactory',
          explanation: 'Dr. Morrison remarks: "Overall, your literature review is thorough".',
        },
      ],
    }),
  },

  {
    id: 'ielts-listening-s4',
    title: 'Section 4: Academic Lecture on the Evolutionary Biology of Cetaceans',
    skill: 'listening',
    type: 'academic',
    part: 'section_4',
    targetBand: 7.5,
    audioUrl: 'https://cdn.freesound.org/previews/567/567341_5674468-lq.mp3',
    content: JSON.stringify({
      transcript: `Professor: Good afternoon, everyone. In today's evolutionary paleobiology lecture, we examine one of the most remarkable macroevolutionary transitions recorded in vertebrate history: the transformation of terrestrial quadrupeds into fully aquatic cetaceans—the clade encompassing modern whales, dolphins, and porpoises.\n\nApproximately 50 million years ago, during the Early Eocene epoch, the earliest ancestral cetacean roamed the shallow shorelines of the ancient Tethys Sea in what is now modern Pakistan and northwestern India. This semi-aquatic artiodactyl is known as Pakicetus. Anatomically, Pakicetus was roughly the size of a modern wolf, with four cursorial limbs adapted for terrestrial locomotion. Crucially, paleontological analysis of its skull revealed a dense, thickened involucrum—a distinctive bony wall in the auditory bulla found exclusively in cetaceans. This demonstrates that hearing adaptations for aquatic environments emerged prior to locomotive transformations.\n\nMoving forward 3 to 4 million years, we encounter Ambulocetus natans, commonly called 'the walking whale'. Fossil specimens indicate elongated feet and powerful spinal undulation resembling modern river otters. Ambulocetus possessed a lifestyle akin to an ambush predator like a modern crocodile, hunting both in brackish estuaries and along freshwater riverbanks.\n\nBy the Late Eocene, roughly 40 million years ago, creatures such as Basilosaurus had developed complete aquatic adaptations. Basilosaurus reached lengths of up to 18 meters, equipped with a hydrodynamic serpentine body and tail flukes. Its hind limbs had dramatically reduced to vestigial appendages less than half a meter long, incapable of supporting body weight on land. Furthermore, the nasal opening had migrated from the snout tip toward the apex of the cranium, laying the evolutionary foundation for the blowhole.\n\nGenetic and morphological consensus confirms that the closest extant terrestrial relatives of cetaceans are hippopotamids, belonging to the order Cetartiodactyla.`,
      questions: [
        {
          id: 'l_s4_q31',
          type: 'multiple_choice',
          prompt: 'Approximately when did the earliest ancestral cetacean transition begin?',
          options: ['50 million years ago', '25 million years ago', '10 million years ago', '100 million years ago'],
          correctAnswer: '50 million years ago',
          explanation: 'The professor states: "Approximately 50 million years ago, during the Early Eocene epoch".',
        },
        {
          id: 'l_s4_q32',
          type: 'multiple_choice',
          prompt: 'In which geographic region were fossils of Pakicetus first discovered?',
          options: ['Modern Pakistan and northwestern India', 'The North American Great Plains', 'The East African Rift Valley', 'Western Australia'],
          correctAnswer: 'Modern Pakistan and northwestern India',
          explanation: 'The lecture mentions: "in what is now modern Pakistan and northwestern India".',
        },
        {
          id: 'l_s4_q33',
          type: 'multiple_choice',
          prompt: 'What was the approximate physical size of Pakicetus?',
          options: ['The size of a modern wolf', 'The size of a blue whale', 'The size of a mouse', 'The size of a giraffe'],
          correctAnswer: 'The size of a modern wolf',
          explanation: 'The professor states: "Pakicetus was roughly the size of a modern wolf".',
        },
        {
          id: 'l_s4_q34',
          type: 'multiple_choice',
          prompt: 'What critical anatomical feature linked Pakicetus to cetaceans?',
          options: [
            'A thickened involucrum in the auditory bulla',
            'Tail flukes for swimming',
            'Baleen plates in its jaws',
            'Absence of hind limbs',
          ],
          correctAnswer: 'A thickened involucrum in the auditory bulla',
          explanation: 'The professor specifies "a dense, thickened involucrum—a distinctive bony wall in the auditory bulla found exclusively in cetaceans".',
        },
        {
          id: 'l_s4_q35',
          type: 'multiple_choice',
          prompt: 'What did the auditory adaptation in Pakicetus prove to evolutionary biologists?',
          options: [
            'Hearing adaptations for water emerged before swimming adaptations',
            'Whales evolved from birds',
            'Pakicetus could echolocate at ultra-high frequencies',
            'Pakicetus lived exclusively at the bottom of the ocean',
          ],
          correctAnswer: 'Hearing adaptations for water emerged before swimming adaptations',
          explanation: 'The lecture states: "hearing adaptations for aquatic environments emerged prior to locomotive transformations".',
        },
        {
          id: 'l_s4_q36',
          type: 'multiple_choice',
          prompt: 'What hunting style was characteristic of Ambulocetus natans?',
          options: ['Ambush predator like a modern crocodile', 'Filter feeding plankton', 'Chasing prey in the open deep ocean', 'Scavenging carrion in deserts'],
          correctAnswer: 'Ambush predator like a modern crocodile',
          explanation: 'The professor says Ambulocetus had "a lifestyle akin to an ambush predator like a modern crocodile".',
        },
        {
          id: 'l_s4_q37',
          type: 'multiple_choice',
          prompt: 'What was the maximum length reached by Basilosaurus specimens?',
          options: ['5 meters', '10 meters', '18 meters', '30 meters'],
          correctAnswer: '18 meters',
          explanation: 'The lecture states: "Basilosaurus reached lengths of up to 18 meters".',
        },
        {
          id: 'l_s4_q38',
          type: 'multiple_choice',
          prompt: 'What happened to the hind limbs of Basilosaurus?',
          options: [
            'They expanded into enormous fins',
            'They shrank into vestigial appendages incapable of supporting weight on land',
            'They evolved into grasping claws',
            'They disappeared completely with no bone remnants',
          ],
          correctAnswer: 'They shrank into vestigial appendages incapable of supporting weight on land',
          explanation: 'The professor notes: "reduced to vestigial appendages less than half a meter long, incapable of supporting body weight on land".',
        },
        {
          id: 'l_s4_q39',
          type: 'multiple_choice',
          prompt: 'How did the nasal opening change over cetacean evolutionary history?',
          options: [
            'It migrated toward the top of the skull to form the blowhole',
            'It moved inside the mouth cavity',
            'It remained unchanged at the tip of the snout',
            'It merged with the auditory bulla',
          ],
          correctAnswer: 'It migrated toward the top of the skull to form the blowhole',
          explanation: 'The lecture explains: "migrated from the snout tip toward the apex of the cranium, laying the evolutionary foundation for the blowhole".',
        },
        {
          id: 'l_s4_q40',
          type: 'multiple_choice',
          prompt: 'Which living animals are the closest terrestrial relatives of cetaceans?',
          options: ['Hippopotamuses', 'Elephants', 'Grizzly bears', 'Sea lions'],
          correctAnswer: 'Hippopotamuses',
          explanation: 'The professor concludes: "closest extant terrestrial relatives of cetaceans are hippopotamids".',
        },
      ],
    }),
  },

  // ==========================================================================
  // 3. WRITING TASKS (EXPANDED TASK 1 & TASK 2 PROMPTS)
  // ==========================================================================
  {
    id: 'ielts-writing-t1-bar',
    title: 'IELTS Writing Task 1: European Renewable Energy Generation (Bar Chart)',
    skill: 'writing',
    type: 'academic',
    part: 'task_1',
    targetBand: 6.5,
    prompt: `The bar chart illustrates the percentage of total electricity generated from renewable sources (solar, wind, and hydro) across four European countries (Germany, Spain, Sweden, and the UK) in 2010, 2015, and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.`,
    content: JSON.stringify({
      suggestedStructure: [
        'Introduction: Paraphrase the prompt (e.g. The bar chart compares the proportion of electricity produced from green energy sources across four nations over a ten-year timeframe).',
        'Overview: Highlight that Sweden consistently dominated green energy generation, whereas the UK demonstrated the most rapid upward trajectory over the decade.',
        'Body 1: Detail figures for Sweden and Germany (e.g. Sweden growing from 48% to 62%, Germany from 18% to 45%).',
        'Body 2: Detail figures for Spain and the United Kingdom (e.g. Spain stabilizing around 35-38%, UK soaring from 7% in 2010 to 42% in 2020).',
      ],
      highBandVocabulary: ['witnessed exponential growth', 'dominated the share', 'upward trajectory', 'tripled', 'marginal fluctuation'],
    }),
  },
  {
    id: 'ielts-writing-t1-process',
    title: 'IELTS Writing Task 1: Industrial Desalination Process (Diagram)',
    skill: 'writing',
    type: 'academic',
    part: 'task_1',
    targetBand: 7.0,
    prompt: `The diagram below shows the industrial process of reverse osmosis desalination used to convert seawater into drinkable municipal freshwater.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.`,
    content: JSON.stringify({
      suggestedStructure: [
        'Introduction: Paraphrase diagram topic (e.g. The schematic illustrates the multi-stage mechanical and chemical procedure through which saline ocean water is purified for human consumption).',
        'Overview: Note that the procedure comprises five primary sequential phases, commencing with seawater intake and filtration and concluding with mineral remineralization and municipal distribution.',
        'Body 1: Initial stages (intake, coarse screening, coagulant flocculation, pre-filter cartridge purification).',
        'Body 2: Core separation and post-treatment (high-pressure pump forcing water through semi-permeable membranes, brine discharge back into sea, addition of calcium/chlorine).',
      ],
      highBandVocabulary: ['intake pipeline', 'semi-permeable membrane', 'hydrostatic pressure', 'brine discharge', 'remineralization'],
    }),
  },
  {
    id: 'ielts-writing-t2-tech',
    title: 'IELTS Writing Task 2: Artificial Intelligence & Future Employment',
    skill: 'writing',
    type: 'academic',
    part: 'task_2',
    targetBand: 7.0,
    prompt: `Some people believe that the rapid advancement of artificial intelligence will lead to massive unemployment and social crises. Others argue that AI will create superior employment opportunities and enhance global economic productivity.\n\nDiscuss both views and give your own opinion.\n\nWrite at least 250 words.`,
    content: JSON.stringify({
      suggestedStructure: [
        'Introduction: Paraphrase debate regarding AI job displacement vs economic prosperity. State a nuanced thesis (e.g. while transition periods cause friction, AI ultimately augments productivity if backed by retraining).',
        'Body 1 (Displacement side): Discuss clerical and cognitive roles replaced by algorithms; potential wealth inequality if profits concentrate in Big Tech.',
        'Body 2 (Productivity side): Discuss historical economic precedents; emergence of novel professions (AI auditors, prompt engineers, bioinformaticians); liberation of humans from repetitive toil.',
        'Conclusion & Personal View: Reaffirm that societal disruption is manageable through progressive policy, continuous education, and ethical governance.',
      ],
      highBandVocabulary: ['unprecedented automation', 'displace redundant labor', 'cognitive tasks', 'socioeconomic disparity', 'augment human ingenuity'],
    }),
  },
  {
    id: 'ielts-writing-t2-env',
    title: 'IELTS Writing Task 2: Individual Action vs Governmental Regulation in Climate Change',
    skill: 'writing',
    type: 'academic',
    part: 'task_2',
    targetBand: 7.0,
    prompt: `Some argue that individual lifestyle choices (such as recycling and using public transit) are insufficient to combat climate change, and that meaningful change can only be achieved through strict governmental legislation on multinational corporations.\n\nTo what extent do you agree or disagree?\n\nWrite at least 250 words.`,
    content: JSON.stringify({
      suggestedStructure: [
        'Introduction: Introduce the climate mitigation debate. Clearly state agreement that systemic government legislation is fundamentally paramount, though individual consumer pressure remains complementary.',
        'Body 1: The primacy of state regulation (carbon pricing, enforcing emissions caps on energy and manufacturing conglomerates, subsidizing renewable infrastructure).',
        'Body 2: The limitations of uncoordinated individual action (tragedy of the commons, consumer options constrained by market availability).',
        'Conclusion: Summarize arguments, asserting that legal frameworks provide the necessary scaffolding for personal behavioral changes to be effective.',
      ],
      highBandVocabulary: ['statutory obligations', 'carbon taxation', 'systemic decarbonization', 'tragedy of the commons', 'enforceable standards'],
    }),
  },

  // ==========================================================================
  // 4. SPEAKING SUITE (PART 1, PART 2 CUE CARDS, AND PART 3 DISCUSSIONS)
  // ==========================================================================
  {
    id: 'ielts-speaking-card-01',
    title: 'IELTS Speaking Part 2: Describe an Inspiring Mentor or Teacher',
    skill: 'speaking',
    type: 'academic',
    part: 'task_2',
    targetBand: 7.0,
    prompt: `Describe a teacher or mentor who has had a significant positive influence on your education or life.\n\nYou should say:\n- Who this person was\n- When and where you met them\n- What subject or skills they taught you\n- And explain why this person inspired you so deeply.`,
    content: JSON.stringify({
      preparationTimeSeconds: 60,
      speakingTimeSeconds: 120,
      sampleBand8Answer: `I would like to talk about Dr. Elizabeth Vance, who was my university lecturer in environmental economics during my sophomore year. What set Dr. Vance apart from conventional academics was her infectious pedagogical passion. Rather than merely reciting textbook slides, she structured every lecture as an interactive parliamentary debate where students had to defend complex ecological policies under real-world budgetary constraints. Her guidance instilled in me not just academic discipline, but critical thinking and intellectual resilience.`,
      followUpQuestionsPart3: [
        'How has the role of teachers transformed with the advent of internet educational platforms?',
        'Do you think artificial intelligence will ever entirely supersede human lecturers in higher education?',
        'What personal attributes differentiate an adequate instructor from a truly inspirational educator?',
      ],
    }),
  },
  {
    id: 'ielts-speaking-card-02',
    title: 'IELTS Speaking Part 2: Describe a Challenging Decision You Made',
    skill: 'speaking',
    type: 'academic',
    part: 'task_2',
    targetBand: 7.5,
    prompt: `Describe a challenging decision you had to make that had an important consequence.\n\nYou should say:\n- What the decision was\n- What options were available to you\n- How you arrived at your final choice\n- And explain how you felt after making this decision.`,
    content: JSON.stringify({
      preparationTimeSeconds: 60,
      speakingTimeSeconds: 120,
      sampleBand8Answer: `A pivotal decision that profoundly altered my trajectory occurred two years ago when I chose to resign from a secure corporate marketing position to pursue an intensive master's degree abroad. On one hand, staying offered financial stability and immediate promotion prospects. On the other hand, venturing overseas presented substantial financial risk and cultural dislocation, yet unlocked immense intellectual growth. After conducting a rigorous cost-benefit evaluation and consulting trusted mentors, I opted for the degree, which proved to be the most enriching experience of my life.`,
      followUpQuestionsPart3: [
        'Why do young adults often experience decision paralysis when choosing career paths?',
        'To what extent should individuals rely on intuition versus logical empirical analysis when deciding?',
        'How do corporate managers balance short-term profitability against ethical long-term decisions?',
      ],
    }),
  },
];

export const SEED_IELTS_VOCAB = [
  { targetText: "Analyze", translation: "Phân tích", phonetic: "/ˈænəlaɪz/", cefrLevel: "B2", category: "academic", exampleSentence: "Researchers analyze data to find trends.", exampleTranslation: "Các nhà nghiên cứu phân tích dữ liệu để tìm ra xu hướng." },
  { targetText: "Substantial", translation: "Đáng kể / Cực lớn", phonetic: "/səbˈstænʃl/", cefrLevel: "B2", category: "academic", exampleSentence: "A substantial amount of investment went into solar energy.", exampleTranslation: "Một lượng đầu tư đáng kể đã vào năng lượng mặt trời." },
  { targetText: "Implement", translation: "Thực thi / Triển khai", phonetic: "/ˈɪmplɪment/", cefrLevel: "B2", category: "academic", exampleSentence: "Governments implement new environmental policies.", exampleTranslation: "Các chính phủ triển khai các chính sách môi trường mới." },
  { targetText: "Fluctuate", translation: "Biến động / Dao động", phonetic: "/ˈflʌktʃueɪt/", cefrLevel: "C1", category: "academic", exampleSentence: "Oil prices fluctuate due to global supply.", exampleTranslation: "Giá dầu biến động do nguồn cung toàn cầu." },
  { targetText: "Prevalent", translation: "Phổ biến / Thịnh hành", phonetic: "/ˈprevələnt/", cefrLevel: "C1", category: "academic", exampleSentence: "Remote work is becoming increasingly prevalent.", exampleTranslation: "Làm việc từ xa ngày càng trở nên phổ biến." },
  { targetText: "Mitigate", translation: "Giảm thiểu / Làm dịu bớt", phonetic: "/ˈmɪtɪɡeɪt/", cefrLevel: "C1", category: "academic", exampleSentence: "Policy makers must mitigate the risks of climate change.", exampleTranslation: "Các nhà hoạch định chính sách phải giảm thiểu rủi ro biến đổi khí hậu." },
  { targetText: "Empirical", translation: "Thực nghiệm / Dựa trên quan sát", phonetic: "/ɪmˈpɪrɪkl/", cefrLevel: "C1", category: "academic", exampleSentence: "Empirical evidence supports this scientific hypothesis.", exampleTranslation: "Bằng chứng thực nghiệm ủng hộ giả thuyết khoa học này." },
  { targetText: "Paradigm", translation: "Hệ hình / Mô hình mẫu", phonetic: "/ˈpærədaɪm/", cefrLevel: "C2", category: "academic", exampleSentence: "The discovery caused a profound paradigm shift in neuroscience.", exampleTranslation: "Phát hiện này đã tạo ra một sự thay đổi hệ hình sâu sắc trong thần kinh học." },
  { targetText: "Disparity", translation: "Sự chênh lệch / Bất bình đẳng", phonetic: "/dɪˈspærəti/", cefrLevel: "C1", category: "academic", exampleSentence: "Economic disparity between rural and urban regions is widening.", exampleTranslation: "Sự chênh lệch kinh tế giữa khu vực nông thôn và thành thị đang nới rộng." },
  { targetText: "Hypothesis", translation: "Giả thuyết khoa học", phonetic: "/haɪˈpɒθəsɪs/", cefrLevel: "B2", category: "academic", exampleSentence: "The research team tested their hypothesis in the laboratory.", exampleTranslation: "Nhóm nghiên cứu đã thử nghiệm giả thuyết của họ trong phòng thí nghiệm." },
  { targetText: "Correlate", translation: "Tương quan / Liên hệ", phonetic: "/ˈkɒrəleɪt/", cefrLevel: "B2", category: "academic", exampleSentence: "High education levels correlate with higher employment stability.", exampleTranslation: "Trình độ học vấn cao có tương quan với sự ổn định việc làm cao hơn." },
  { targetText: "Disseminate", translation: "Phổ biến / Lan truyền thông tin", phonetic: "/dɪˈsemɪneɪt/", cefrLevel: "C2", category: "academic", exampleSentence: "Academic journals disseminate new scientific discoveries globally.", exampleTranslation: "Các tạp chí học thuật phổ biến những phát hiện khoa học mới trên toàn cầu." },
  { targetText: "Synthesize", translation: "Tổng hợp / Kết hợp", phonetic: "/ˈsɪnθəsaɪz/", cefrLevel: "C1", category: "academic", exampleSentence: "Students must synthesize arguments from multiple source texts.", exampleTranslation: "Học sinh phải tổng hợp các lập luận từ nhiều nguồn văn bản khác nhau." },
  { targetText: "Predecessor", translation: "Người tiền nhiệm / Thế hệ đi trước", phonetic: "/ˈpriːdəsesə/", cefrLevel: "C1", category: "academic", exampleSentence: "The new engine is much quieter than its predecessor.", exampleTranslation: "Động cơ mới êm hơn nhiều so với động cơ tiền nhiệm của nó." },
  { targetText: "Ubiquitous", translation: "Có mặt khắp nơi / Nhan nhản", phonetic: "/juːˈbɪkwɪtəs/", cefrLevel: "C2", category: "academic", exampleSentence: "Smartphones have become ubiquitous in contemporary society.", exampleTranslation: "Điện thoại thông minh đã trở nên phổ biến khắp mọi nơi trong xã hội hiện đại." },
  { targetText: "Coherent", translation: "Mạch lạc / Chặt chẽ", phonetic: "/kəʊˈhɪərənt/", cefrLevel: "B2", category: "academic", exampleSentence: "The applicant gave a coherent and convincing presentation.", exampleTranslation: "Ứng viên đã có một bài thuyết trình mạch lạc và thuyết phục." },
  { targetText: "Inherent", translation: "Vốn có / Cố hữu", phonetic: "/ɪnˈhɪərənt/", cefrLevel: "C1", category: "academic", exampleSentence: "There are inherent risks in every financial investment.", exampleTranslation: "Có những rủi ro vốn có trong mọi khoản đầu tư tài chính." },
  { targetText: "Feasible", translation: "Khả thi / Có thể thực hiện", phonetic: "/ˈfiːzəbl/", cefrLevel: "B2", category: "academic", exampleSentence: "Engineers confirmed that the solar project is technically feasible.", exampleTranslation: "Các kỹ sư xác nhận rằng dự án năng lượng mặt trời là khả thi về mặt kỹ thuật." },
  { targetText: "Scrutinize", translation: "Soi xét / Kiểm tra kỹ lưỡng", phonetic: "/ˈskruːtənaɪz/", cefrLevel: "C1", category: "academic", exampleSentence: "Regulators scrutinize banking transactions for fraud.", exampleTranslation: "Các cơ quan quản lý soi xét kỹ lưỡng các giao dịch ngân hàng để phòng gian lận." },
  { targetText: "Exemplify", translation: "Minh họa điển hình cho", phonetic: "/ɪɡˈzemplɪfaɪ/", cefrLevel: "C1", category: "academic", exampleSentence: "Her career exemplifies dedication and academic rigor.", exampleTranslation: "Sự nghiệp của cô ấy là minh chứng điển hình cho sự tận tụy và chuẩn mực học thuật." },
];

export async function seedIeltsData() {
  console.log('🌱 Seeding Comprehensive IELTS Exam Suite Data...');

  // 1. Seed Tracks
  for (const track of SEED_IELTS_TRACKS) {
    const existing = await prisma.ieltsTrack.findFirst({
      where: { targetBand: track.targetBand, type: track.type },
    });
    if (!existing) {
      await prisma.ieltsTrack.create({ data: track });
    }
  }

  // 2. Seed Questions (upsert by title)
  for (const q of SEED_IELTS_QUESTIONS) {
    const existing = await prisma.ieltsQuestion.findFirst({
      where: { title: q.title },
    });
    if (!existing) {
      await prisma.ieltsQuestion.create({ data: q });
    } else {
      await prisma.ieltsQuestion.update({
        where: { id: existing.id },
        data: {
          skill: q.skill,
          type: q.type,
          part: q.part,
          targetBand: q.targetBand,
          passageText: (q as any).passageText || null,
          prompt: (q as any).prompt || null,
          audioUrl: (q as any).audioUrl || null,
          content: q.content,
        },
      });
    }
  }

  // 3. Seed Vocab into main Vocabulary table with 'academic' category
  for (const v of SEED_IELTS_VOCAB) {
    const existing = await prisma.vocabulary.findFirst({
      where: { targetText: v.targetText },
    });
    if (!existing) {
      await prisma.vocabulary.create({ data: v });
    }
  }

  console.log(`✅ IELTS Exam Prep Data Seeded: ${SEED_IELTS_QUESTIONS.length} Questions/Prompts, ${SEED_IELTS_VOCAB.length} AWL terms!`);
}

if (require.main === module) {
  seedIeltsData()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
