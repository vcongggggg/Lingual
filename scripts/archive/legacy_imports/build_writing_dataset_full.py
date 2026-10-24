import json

# Load base prompts and append additional ones
with open("scripts/build_writing_dataset.py", "r", encoding="utf-8") as f:
    orig = f.read()

# Let's write the complete, expanded python script
additional_prompts = [
    # SEE-WRITE
    {
        "id": "see-write-a1-breakfast",
        "mode": "see-write",
        "difficulty": "A1",
        "title": "Healthy Morning Breakfast Table",
        "instruction": "Hãy viết 2-3 câu mô tả đĩa đồ ăn sáng và ly nước cam trên bàn ăn.",
        "imageHint": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=700&auto=format&fit=crop&q=80",
        "scenario": "Bánh mì nướng giòn, trứng ốp la và ly nước cam tươi mát trên bàn gỗ.",
        "targetWords": ["toast", "orange juice", "egg", "breakfast", "tasty"],
        "targetGrammar": "I like to eat / There is a glass of...",
        "sampleAnswer": "There is a plate of hot toast and eggs on the table. I drink a fresh glass of orange juice. This breakfast is very tasty and healthy.",
        "category": "Food & Drink",
        "minWords": 10,
        "maxWords": 45
    },
    {
        "id": "see-write-a2-rainy-city",
        "mode": "see-write",
        "difficulty": "A2",
        "title": "Walking in the Rain with Umbrellas",
        "instruction": "Mô tả dòng người cầm ô đủ màu sắc đi bộ dưới cơn mưa rào thành phố.",
        "imageHint": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=700&auto=format&fit=crop&q=80",
        "scenario": "Ánh đèn đường phản chiếu lung linh trên mặt đường ướt sũng.",
        "targetWords": ["rain", "umbrella", "street", "reflection", "puddle"],
        "targetGrammar": "While / As clauses: While it is raining, people carry umbrellas...",
        "sampleAnswer": "Heavy rain is falling across the downtown avenue. People are holding colorful umbrellas to stay dry while walking past coffee shops. Streetlights reflect beautifully in large water puddles.",
        "category": "Weather & City",
        "minWords": 18,
        "maxWords": 65
    },
    {
        "id": "see-write-a2-beach-volleyball",
        "mode": "see-write",
        "difficulty": "A2",
        "title": "Exciting Beach Volleyball Match",
        "instruction": "Mô tả nhóm thanh niên đang chơi bóng chuyền bãi biển vào kỳ nghỉ cuối tuần.",
        "imageHint": "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=700&auto=format&fit=crop&q=80",
        "scenario": "Những cú nhảy đập bóng ngoạn mục trên bãi cát vàng chan hòa nắng gió.",
        "targetWords": ["volleyball", "beach", "jump", "team", "energy"],
        "targetGrammar": "Action verbs & Adverbs: jumping high, cheering loudly",
        "sampleAnswer": "A group of athletic friends is playing volleyball on the sandy beach. One player jumps high to spike the white ball across the net. Everyone is cheering loudly under the bright afternoon sun.",
        "category": "Sports & Leisure",
        "minWords": 18,
        "maxWords": 65
    },
    {
        "id": "see-write-b1-doctor-consultation",
        "mode": "see-write",
        "difficulty": "B1",
        "title": "Pediatric Doctor Examining a Patient",
        "instruction": "Mô tả bác sĩ đang ân cần kiểm tra sức khỏe và dặn dò bệnh nhân nhỏ tuổi tại phòng khám.",
        "imageHint": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=700&auto=format&fit=crop&q=80",
        "scenario": "Bác sĩ dùng ống nghe kiểm tra nhịp tim và trao nụ cười khích lệ cậu bé.",
        "targetWords": ["physician", "stethoscope", "consultation", "reassure", "examination"],
        "targetGrammar": "Modal verbs of advice: should rest, ought to take medicine",
        "sampleAnswer": "The physician uses a stethoscope to examine the young patient's heartbeat in a well-equipped clinic. She smiles warmly to reassure the child while explaining that he should rest and drink plenty of warm fluids to recover quickly.",
        "category": "Healthcare",
        "minWords": 25,
        "maxWords": 80
    },
    {
        "id": "see-write-b1-construction-architecture",
        "mode": "see-write",
        "difficulty": "B1",
        "title": "Architect Reviewing Blueprints on Site",
        "instruction": "Mô tả kỹ sư trưởng đội mũ bảo hộ đang đối chiếu bản vẽ kỹ thuật với tòa nhà đang thi công.",
        "imageHint": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=700&auto=format&fit=crop&q=80",
        "scenario": "Công trường xây dựng hiện đại với cần cẩu tháp và kết cấu thép đồ sộ.",
        "targetWords": ["blueprint", "architect", "construction", "scaffolding", "structural"],
        "targetGrammar": "Present Perfect Continuous: have been constructing / have been checking",
        "sampleAnswer": "Wearing a protective yellow helmet, the structural architect examines architectural blueprints directly at the construction site. Engineers have been working meticulously to ensure that the steel scaffolding conforms strictly to rigorous seismic safety standards.",
        "category": "Architecture & Engineering",
        "minWords": 25,
        "maxWords": 85
    },
    {
        "id": "see-write-b2-art-gallery",
        "mode": "see-write",
        "difficulty": "B2",
        "title": "Visitors Contemplating Contemporary Art",
        "instruction": "Bình luận về không gian trưng bày tranh trừu tượng và sự tương tác cảm xúc của khách tham quan triển lãm.",
        "imageHint": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=700&auto=format&fit=crop&q=80",
        "scenario": "Khách tham quan đứng tĩnh lặng trước bức tranh khổ lớn mang gam màu tương phản mạnh mẽ.",
        "targetWords": ["contemplate", "contemporary", "abstract", "provocative", "aesthetic"],
        "targetGrammar": "Participle phrases: Standing silently before the canvas, visitors reflect on...",
        "sampleAnswer": "Standing silently before an expansive minimalist canvas, gallery visitors contemplate the provocative emotional tension evoked by conflicting color fields. The serene museum lighting accentuates nuanced textural brushstrokes, inviting spectators to construct deeply subjective aesthetic interpretations.",
        "category": "Arts & Culture",
        "minWords": 30,
        "maxWords": 95
    },
    {
        "id": "see-write-b2-satellite-launch",
        "mode": "see-write",
        "difficulty": "B2",
        "title": "Orbital Rocket Ignition at Cape Canaveral",
        "instruction": "Mô tả khoảnh khắc tên lửa vũ trụ kích hoạt động cơ đẩy bùng cháy và bay vút vào bầu khí quyển.",
        "imageHint": "https://images.unsplash.com/photo-1517976487515-5606d507b9a5?w=700&auto=format&fit=crop&q=80",
        "scenario": "Cột khói lửa khổng lồ nâng tên lửa vượt qua tầng đối lưu hướng vào quỹ đạo Trái Đất.",
        "targetWords": ["propulsion", "trajectory", "ignition", "orbital", "aerodynamic"],
        "targetGrammar": "Inversion with negative adverbs: Scarcely had the engines ignited when...",
        "sampleAnswer": "Upon ignition, multi-stage cryogenic rocket thrusters unleash immense kinetic propulsion, illuminating the coastal launch pad with searing plasma flames. As the vehicle ascents along its precalculated parabolic trajectory, onboard telemetry systems continuously relay guidance parameters to ground mission control.",
        "category": "Space Exploration",
        "minWords": 30,
        "maxWords": 100
    },
    {
        "id": "see-write-b2-3d-prosthetics",
        "mode": "see-write",
        "difficulty": "B2",
        "title": "3D-Printed Bionic Arm Calibration",
        "instruction": "Mô tả một kỹ sư y sinh đang tinh chỉnh cánh tay giả sinh học thông minh điều khiển bằng tín hiệu cơ điện.",
        "imageHint": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=700&auto=format&fit=crop&q=80",
        "scenario": "Cánh tay giả bằng titan và carbon kết nối với máy tính để hiệu chuẩn cảm biến thần kinh.",
        "targetWords": ["prosthetic", "bionic", "calibrate", "myoelectric", "biomechanical"],
        "targetGrammar": "Conditional type 3 or mixed conditionals: Had additive manufacturing not evolved...",
        "sampleAnswer": "A biomedical engineer meticulously calibrates myoelectric sensor electrodes embedded inside a lightweight 3D-printed bionic limb. By mapping subtle muscle twitches to robotic finger articulations, this biomechanical advancement empowers amputees to regain natural dexterity and tactile independence.",
        "category": "Biomedical Engineering",
        "minWords": 30,
        "maxWords": 100
    },

    # GUIDED
    {
        "id": "guided-a1-daily-schedule",
        "mode": "guided",
        "difficulty": "A1",
        "title": "My Typical Weekday Schedule",
        "instruction": "Viết đoạn văn ngắn miêu tả thời gian biểu một ngày bình thường của bạn từ sáng đến tối.",
        "scenario": "Chia sẻ về giờ giấc thức dậy, đi học/đi làm và giải trí buổi tối.",
        "targetWords": ["wake up", "school", "lunch", "homework", "sleep"],
        "targetGrammar": "Prepositions of time: at 7:00 AM, in the morning, on weekdays",
        "sampleAnswer": "On weekdays, I wake up at six thirty in the morning and wash my face. I take the bus to school at seven fifteen. In the afternoon, I study English and play badminton with friends. After doing homework, I go to bed at ten thirty.",
        "category": "Daily Routine",
        "minWords": 25,
        "maxWords": 60,
        "guidedSteps": [
            {"stepNumber": 1, "question": "What time do you usually wake up on weekdays?", "hint": "I usually wake up at ...", "samplePhrase": "I wake up at six o'clock every morning."},
            {"stepNumber": 2, "question": "How do you commute to school or work?", "hint": "I go by bike / bus / walk...", "samplePhrase": "I ride my bicycle to school after eating a quick breakfast."},
            {"stepNumber": 3, "question": "What is your main afternoon activity?", "hint": "Classes, gym, work...", "samplePhrase": "In the afternoon, I attend computer science lectures and study in the library."},
            {"stepNumber": 4, "question": "How do you unwind before going to sleep?", "hint": "Listen to music, read a book...", "samplePhrase": "I listen to soothing acoustic music before falling asleep at eleven."}
        ]
    },
    {
        "id": "guided-a2-favorite-movie",
        "mode": "guided",
        "difficulty": "A2",
        "title": "Review of a Film You Loved",
        "instruction": "Kể về một bộ phim đáng nhớ mà bạn từng xem tại rạp hoặc trên mạng theo các bước hướng dẫn.",
        "scenario": "Tên phim, thể loại, nhân vật ấn tượng và bài học rút ra.",
        "targetWords": ["movie", "character", "actor", "plot", "emotional"],
        "targetGrammar": "Relative clauses: which is directed by / who is played by",
        "sampleAnswer": "Last weekend I watched 'Interstellar', which is a famous science-fiction film directed by Christopher Nolan. The main character is Cooper, an astronaut who travels through a wormhole to find a new home for humanity. The special effects were breathtaking and the soundtrack made me emotional. I recommend this masterpiece to everyone.",
        "category": "Entertainment",
        "minWords": 35,
        "maxWords": 85,
        "guidedSteps": [
            {"stepNumber": 1, "question": "What is the movie title and what genre does it belong to?", "hint": "It is a comedy / sci-fi / animation...", "samplePhrase": "My all-time favorite movie is 'Coco', an animated fantasy film produced by Pixar."},
            {"stepNumber": 2, "question": "Who is the central character and what is their quest?", "hint": "The protagonist is a boy who dreams of...", "samplePhrase": "The story follows Miguel, a young Mexican boy who dreams of becoming a musician."},
            {"stepNumber": 3, "question": "Which visual or musical elements impressed you the most?", "hint": "Vibrant colors, memorable soundtrack...", "samplePhrase": "The Land of the Dead was portrayed with stunning glowing bridges and catchy acoustic songs."},
            {"stepNumber": 4, "question": "What meaningful life lesson did you learn from the film?", "hint": "Family bonds, remembering ancestors...", "samplePhrase": "It taught me that family love transcends physical boundaries as long as we remember them."}
        ]
    },
    {
        "id": "guided-b1-reschedule-email",
        "mode": "guided",
        "difficulty": "B1",
        "title": "Professional Appointment Rescheduling Email",
        "instruction": "Viết email trang trọng gửi đối tác để xin hoãn cuộc họp do phát sinh sự cố khẩn cấp.",
        "scenario": "Xin lỗi vì sự bất tiện và đề xuất 2 khung giờ thay thế trong tuần sau.",
        "targetWords": ["reschedule", "unforeseen", "inconvenience", "availability", "confirm"],
        "targetGrammar": "Polite modals: Would it be possible to..., I apologize for any inconvenience caused",
        "sampleAnswer": "Dear Mr. Davies, I am writing to respectfully request rescheduling our project status meeting originally slated for this Thursday at 2:00 PM. Due to an unforeseen urgent client escalation, I must travel offsite. Would it be possible to convene next Tuesday at 10:00 AM or Wednesday at 3:00 PM instead? I sincerely apologize for any inconvenience caused and await your confirmation. Sincerely, Hoang Nam.",
        "category": "Business Communication",
        "minWords": 45,
        "maxWords": 105,
        "guidedSteps": [
            {"stepNumber": 1, "question": "State the purpose of the email and reference the original meeting time.", "hint": "I am writing to inquire about rescheduling our appointment on...", "samplePhrase": "I am writing to request a postponement of our consultation scheduled for Friday morning."},
            {"stepNumber": 2, "question": "Provide a professional, concise reason without oversharing personal details.", "hint": "Due to unforeseen circumstances / conflicting schedule...", "samplePhrase": "Owing to an unexpected family emergency, I will be unavailable to attend our session in person."},
            {"stepNumber": 3, "question": "Propose two specific alternative time slots.", "hint": "Could we reschedule to either Monday at 9 AM or Thursday at 2 PM?", "samplePhrase": "Would either Monday afternoon at 3:00 PM or Thursday morning at 10:00 AM suit your schedule?"},
            {"stepNumber": 4, "question": "Offer a sincere apology for disruptions caused to their calendar.", "hint": "Please accept my apologies for the inconvenience...", "samplePhrase": "I deeply regret any disruption this adjustment may cause and look forward to your reply."}
        ]
    },
    {
        "id": "guided-b2-green-building-proposal",
        "mode": "guided",
        "difficulty": "B2",
        "title": "Biophilic Architecture and Rooftop Garden Proposal",
        "instruction": "Soạn thảo đề xuất cải tạo tòa nhà công sở thành không gian xanh tích hợp vườn trên mái.",
        "scenario": "Giải thích tác dụng giảm nhiệt bức xạ mặt trời và cải thiện tinh thần nhân viên.",
        "targetWords": ["biophilic", "insulation", "wellbeing", "retrofitting", "thermal"],
        "targetGrammar": "Cleft sentences & Subordinating contrast (not only does it insulate, but it also...)",
        "sampleAnswer": "This memorandum proposes retrofitting our corporate headquarters with a biophilic rooftop garden and modular vertical green walls. Incorporating extensive vegetation not only delivers superior thermal insulation that reduces air conditioning power draw by twenty percent, but it also elevates employee mental wellbeing. What makes this environmental capital expenditure worthwhile is the rapid four-year payback period achieved through municipal energy rebates.",
        "category": "Architecture & Sustainability",
        "minWords": 50,
        "maxWords": 125,
        "guidedSteps": [
            {"stepNumber": 1, "question": "Propose the specific architectural green retrofit.", "hint": "We propose retrofitting the facility with...", "samplePhrase": "We propose installing an extensive modular green roof and rainwater harvesting cistern on the main tower."},
            {"stepNumber": 2, "question": "Detail the thermodynamic and energy conservation dividends.", "hint": "Thermal insulation, reducing urban heat island effect...", "samplePhrase": "Soil vegetation absorbs intense solar irradiance, drastically lowering cooling expenditures during summer heatwaves."},
            {"stepNumber": 3, "question": "Address employee cognitive performance and stress alleviation.", "hint": "Exposure to natural foliage enhances concentration...", "samplePhrase": "Access to lush outdoor greenery provides restorative breaks that demonstrably combat corporate burnout."},
            {"stepNumber": 4, "question": "Provide financial justification through long-term utility savings.", "hint": "Lowering HVAC operating expenses and obtaining tax credits...", "samplePhrase": "The capital investment will be recouped within five years via diminished utility bills and government green certifications."}
        ]
    },
    {
        "id": "guided-c1-bci-ethics",
        "mode": "guided",
        "difficulty": "C1",
        "title": "Bioethics Advisory on Brain-Computer Neural Interfaces",
        "instruction": "Soạn bản khuyến nghị chính sách về quyền riêng tư thần kinh học (neurorights) trước sự bùng nổ của chip cấy não.",
        "scenario": "Cảnh báo nguy cơ dữ liệu sóng não bị doanh nghiệp khai thác thương mại và thao túng tâm lý.",
        "targetWords": ["neurorights", "subconscious", "commercialize", "cognitive liberty", "inviolable"],
        "targetGrammar": "Advanced subjunctive and conditional structures (Were mental privacy not guaranteed...)",
        "sampleAnswer": "This bioethics advisory urges the codification of explicit 'neurorights' to shield subconscious cognitive privacy against commercial exploitation. As high-bandwidth invasive neural implants transition from neurological prosthetics into consumer gadgets, tech conglomerates risk acquiring unrestricted telemetry over individuals' raw affective states. Were cognitive liberty not enshrined as an inviolable human right, neuromarketing algorithms could manipulate human autonomy at the subconscious neurochemical level.",
        "category": "Neuroethics & Policy",
        "minWords": 60,
        "maxWords": 140,
        "guidedSteps": [
            {"stepNumber": 1, "question": "Identify the emergence of commercial neural implants beyond therapeutic medicine.", "hint": "The transition of neural interfaces into consumer lifestyle gadgets...", "samplePhrase": "The rapid commercialization of consumer-facing neural telemetry gadgets introduces unprecedented privacy frontiers."},
            {"stepNumber": 2, "question": "Expose the vulnerability of subconscious thought patterns to corporate harvesting.", "hint": "Neural readouts reveal political preferences, emotional states...", "samplePhrase": "Continuous electroencephalographic data streams allow algorithmic tracking of subconscious biometric intent and latent desires."},
            {"stepNumber": 3, "question": "Define and advocate for the universal right to 'cognitive liberty'.", "hint": "The fundamental right of individuals to retain sovereignty over their minds...", "samplePhrase": "International human rights charters must recognize cognitive liberty as an inviolable prerequisite for free will."},
            {"stepNumber": 4, "question": "Prescribe strict statutory penalties for unconsented neural data monetization.", "hint": "Banning commercial profiling on intracranial telemetry...", "samplePhrase": "Legislatures must outlaw the unauthorized monetization of intracranial brain data to safeguard mental sanctuary."}
        ]
    },

    # FREE WRITING
    {
        "id": "free-a2-letter-penpal",
        "mode": "free",
        "difficulty": "A2",
        "title": "A Friendly Letter to a New Penpal",
        "instruction": "Viết một bức thư ngắn (50-80 từ) gửi cho bạn qua thư người nước ngoài để giới thiệu về đất nước và đồ ăn Việt Nam.",
        "scenario": "Giới thiệu món phở bò, nón lá và mời bạn đến thăm vào dịp Tết.",
        "targetWords": ["penpal", "delicious", "traditional", "pho", "welcome"],
        "targetGrammar": "Greetings & Invitations: I would like to invite you / You can try...",
        "sampleAnswer": "Dear Lucas, I am very glad to be your penpal! I live in Hanoi, the historic capital of Vietnam. Our country is famous for hospitable people and delicious street food like Pho and fresh spring rolls. In spring, we celebrate the Lunar New Year with colorful flowers. I would love to show you around if you visit Vietnam one day! Warm regards, Linh.",
        "category": "Culture & Letters",
        "minWords": 40,
        "maxWords": 90
    },
    {
        "id": "free-b1-fast-fashion-impact",
        "mode": "free",
        "difficulty": "B1",
        "title": "The Hidden Costs of Fast Fashion",
        "instruction": "Trình bày suy nghĩ của bạn (75-120 từ) về tác hại của việc mua sắm quần áo giá rẻ dùng một lần rồi vứt bỏ.",
        "scenario": "Liên hệ giữa xu hướng thời trang nhanh với ô nhiễm nguồn nước và rác thải bãi chôn lấp.",
        "targetWords": ["garment", "consumption", "synthetic", "landfill", "conscious"],
        "targetGrammar": "Cause and consequence: Lead to, result in, encourage people to...",
        "sampleAnswer": "Fast fashion brands release new apparel collections weekly at extraordinarily cheap prices, enticing consumers to treat garments as disposable goods. However, this hyper-consumption creates severe environmental catastrophe. Synthetic fibers like polyester do not decompose, generating millions of tons of landfill waste and shedding microplastics into marine waters. Furthermore, toxic dyes poison rivers in developing nations. To counter this crisis, consumers must become conscious shoppers, choosing durable thrifted clothes and supporting ethical fashion brands.",
        "category": "Environment & Lifestyle",
        "minWords": 70,
        "maxWords": 130
    },
    {
        "id": "free-b2-cultivated-meat-future",
        "mode": "free",
        "difficulty": "B2",
        "title": "Cellular Agriculture: Can Lab-Grown Meat Save the Planet?",
        "instruction": "Evaluate the viability and consumer acceptance of bioreactor-cultivated clean meat (90-150 words).",
        "scenario": "Balance greenhouse gas emission reduction against production costs and consumer skepticism.",
        "targetWords": ["bioreactor", "cultivated", "slaughterhouse", "methane", "skepticism"],
        "targetGrammar": "Passive infinitives & Evaluative adjectives (imperative, indispensable, fraught with)",
        "sampleAnswer": "Conventional industrial livestock farming accounts for staggering greenhouse emissions, massive deforestation, and severe animal welfare concerns. Cellular agriculture presents a revolutionary technological alternative: brewing authentic muscle tissue inside sterile bioreactors without slaughterhouses. Cultivating meat cell cultures dramatically curtails methane output and spares vast tracts of agrarian land. Nevertheless, scaling production requires overcoming formidable economic hurdles, notably the high cost of nutrient growth media. Additionally, widespread public skepticism toward 'laboratory food' must be addressed through rigorous food safety transparency. If cost parity is achieved, cultivated protein could fundamentally redefine global nutrition sustainably.",
        "category": "Food Science & Ethics",
        "minWords": 90,
        "maxWords": 160
    },
    {
        "id": "free-c1-ubi-post-work",
        "mode": "free",
        "difficulty": "C1",
        "title": "Universal Basic Income in the Post-Work Economy",
        "instruction": "Examine whether an unconditional Universal Basic Income (UBI) is necessary in an era of deep automation (120-180 words).",
        "scenario": "Analyze the decoupling of human survival from wage labor versus risks of hyperinflation and civic disengagement.",
        "targetWords": ["emancipation", "disincentivize", "unconditional", "redistribution", "sovereignty"],
        "targetGrammar": "Substantive philosophical framing, balancing antinomies, subjunctive constructions",
        "sampleAnswer": "As artificial intelligence systems automate complex cognitive and manual labor, the classical social contract anchoring subsistence to wage labor becomes untenable. Proponents champion Universal Basic Income as a vital redistributive mechanism that ensures basic economic sovereignty, liberating citizens from precarious survival to pursue creative, educational, and caretaking endeavors. Critics caution that an unconditional dividend may disincentivize productivity, trigger fiscal strain, and dissolve community cohesion centered on vocational pride. However, when algorithmic productivity concentrates immense capital yields into monopolistic tech conglomerates, UBI ceases to be a utopian indulgence; it becomes an essential macroeconomic stabilizer to prevent systemic aggregate demand collapse.",
        "category": "Economics & Social Philosophy",
        "minWords": 110,
        "maxWords": 200
    },
    {
        "id": "free-c1-geoengineering-dilemma",
        "mode": "free",
        "difficulty": "C1",
        "title": "Solar Radiation Management vs Radical Carbon Abatement",
        "instruction": "Argue whether research into solar geoengineering creates a dangerous moral hazard for emissions abatement (120-180 words).",
        "scenario": "Weigh the ethical peril of relying on technological techno-fixes versus climate tipping point emergencies.",
        "targetWords": ["geoengineering", "moral hazard", "mitigation", "temperatures", "indispensable"],
        "targetGrammar": "Advanced concessive structures: While it may be argued that..., the underlying risk remains...",
        "sampleAnswer": "The debate over solar radiation management (SRM) embodies the quintessential dilemma of contemporary climate governance. Detractors persuasively argue that legitimizing aerosol geoengineering introduces an intolerable moral hazard, gifting fossil fuel conglomerates an excuse to delay radical industrial decarbonization under the illusion of a technological safety net. Yet, given that biosphere heating is already approaching irrecoverable tipping points, dogmatic refusal to investigate palliative planetary cooling tools is equally irresponsible. SRM cannot substitute for systemic emissions abatement, as it leaves ocean acidification entirely unchecked. Nonetheless, empirical research into stratospheric dynamics must proceed under rigorous multilateral treaties, ensuring humanity understands the mechanism should emergency climate stabilization become tragically necessary.",
        "category": "Climate Policy & Ethics",
        "minWords": 110,
        "maxWords": 200
    }
]

# Read original prompts and append additional ones
import sys
sys.path.insert(0, ".")
from scripts.build_writing_dataset import prompts as base_prompts

all_prompts = base_prompts + additional_prompts

header = "import { WritingPrompt } from '../../../../packages/domain/src/index.js';\n\nexport const EXPANDED_WRITING_PROMPTS: WritingPrompt[] = "
ts_code = header + json.dumps(all_prompts, indent=2, ensure_ascii=False) + ";\n"

with open("apps/api/src/data/writingExpandedData.ts", "w", encoding="utf-8") as f:
    f.write(ts_code)

print(f"Successfully generated {len(all_prompts)} expanded writing prompts in writingExpandedData.ts.")
