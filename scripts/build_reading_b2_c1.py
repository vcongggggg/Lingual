import json
import re

b2_articles = [
    {
        "id": "b2-ai-workplace-automation",
        "title": "Workplace Automation: Symbiosis Over Displacement",
        "subtitle": "How generative agents augment professional workflows without eradicating human agency",
        "level": "B2",
        "topic": "Technology",
        "author": "Dr. Aris Vance",
        "estimatedMinutes": 4,
        "wordCount": 245,
        "coverImage": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "b2-ai-workplace-automation-p1",
                "order": 1,
                "english": "Pessimistic predictions regarding artificial intelligence frequently forecast catastrophic white-collar unemployment. However, empirical industrial observations suggest an alternative paradigm: algorithmic augmentation rather than outright human replacement.",
                "vietnamese": "Những dự báo bi quan về trí tuệ nhân tạo thường tiên đoán tình trạng thất nghiệp diện rộng của giới văn phòng. Tuy nhiên, các quan sát thực nghiệm trong ngành cho thấy một mô hình thay thế: sự gia tăng năng lực nhờ thuật toán thay vì thay thế hoàn toàn con người."
            },
            {
                "id": "b2-ai-workplace-automation-p2",
                "order": 2,
                "english": "Routine cognitive tasks such as rudimentary data extraction and boilerplate drafting are rapidly delegated to autonomous agents. Consequently, knowledge workers pivot toward high-order problem formulation, ethical adjudication, and empathetic cross-functional synthesis.",
                "vietnamese": "Các tác vụ nhận thức lặp lại như trích xuất dữ liệu cơ bản và soạn thảo bản nháp mẫu được nhanh chóng ủy thác cho các tác nhân tự hành. Nhờ đó, người lao động tri thức chuyển trọng tâm sang việc định hình vấn đề bậc cao, phán đoán đạo đức và tổng hợp liên chức năng giàu tính đồng cảm."
            }
        ],
        "questions": [
            {
                "id": "b2-ai-workplace-automation-q1",
                "order": 1,
                "type": "main-idea",
                "question": "What is the primary conclusion regarding AI's impact on knowledge work?",
                "options": ["AI augments human professionals rather than merely eliminating jobs", "All white-collar positions will disappear within five years", "Humans will only perform manual mechanical tasks", "Companies should ban all algorithmic software"],
                "correctAnswer": "AI augments human professionals rather than merely eliminating jobs",
                "explanation": "Paragraph 1 highlights algorithmic augmentation rather than outright replacement.",
                "difficulty": "B2",
                "relatedParagraph": 1
            },
            {
                "id": "b2-ai-workplace-automation-q2",
                "order": 2,
                "type": "multiple-choice",
                "question": "Which capabilities become more valuable for human employees as routine tasks automate?",
                "options": ["High-order problem formulation and ethical judgment", "Rote arithmetic memorization", "Manual typewriter transcription", "Physical postal mail sorting"],
                "correctAnswer": "High-order problem formulation and ethical judgment",
                "explanation": "Paragraph 2 explicitly lists high-order problem formulation, ethical adjudication, and empathetic synthesis.",
                "difficulty": "B2",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "b2-renewable-energy-grids",
        "title": "Decentralized Smart Grids and Intermittent Clean Energy",
        "subtitle": "Overcoming grid instability with utility-scale battery storage and dynamic load balancing",
        "level": "B2",
        "topic": "Environment & Energy",
        "author": "Dr. Henrik Lindqvist",
        "estimatedMinutes": 4,
        "wordCount": 260,
        "coverImage": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "b2-renewable-energy-grids-p1",
                "order": 1,
                "english": "The proliferation of photovoltaic panels and offshore wind turbines presents a fundamental grid stability paradox. Solar and aerodynamic energy yields fluctuate drastically based on diurnal cycles and meteorological anomalies, jeopardizing transmission equilibria.",
                "vietnamese": "Sự phổ biến của các tấm pin quang điện và tuabin gió ngoài khơi tạo ra một nghịch lý cơ bản về độ ổn định lưới điện. Sản lượng năng lượng mặt trời và gió biến động mạnh theo chu kỳ ngày đêm và dị thường thời tiết, đe dọa sự cân bằng truyền tải."
            },
            {
                "id": "b2-renewable-energy-grids-p2",
                "order": 2,
                "english": "To rectify this intermittency, modern municipal utilities deploy utility-scale lithium-iron-phosphate batteries alongside predictive machine-learning load balancers. These intelligent grids automatically absorb surge generation during midday peaks and disburse power during residential twilight demand.",
                "vietnamese": "Để khắc phục tính chập chờn này, các công ty tiện ích đô thị hiện đại triển khai hệ thống pin lithium-sắt-phốt phát quy mô lớn cùng các thuật toán cân bằng tải dự đoán học máy. Những lưới điện thông minh này tự động tích trữ nguồn phát dư thừa trong giờ cao điểm ban ngày và phân phối điện trong giờ dùng cao điểm lúc chập tối."
            }
        ],
        "questions": [
            {
                "id": "b2-renewable-energy-grids-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "What is the primary technical obstacle facing solar and wind power generation?",
                "options": ["Intermittent yield dependent on weather and day-night cycles", "Excessive greenhouse emissions during operation", "Complete inability to conduct electricity through copper lines", "High nuclear radiation levels"],
                "correctAnswer": "Intermittent yield dependent on weather and day-night cycles",
                "explanation": "Paragraph 1 describes yields fluctuating drastically based on diurnal cycles and meteorological anomalies.",
                "difficulty": "B2",
                "relatedParagraph": 1
            },
            {
                "id": "b2-renewable-energy-grids-q2",
                "order": 2,
                "type": "inference",
                "question": "How do intelligent grids stabilize supply during twilight residential peaks?",
                "options": ["By disbursing surplus energy previously stored in utility batteries", "By shutting down electrical substations throughout the city", "By burning coal exclusively at dusk", "By disconnecting solar panels permanently"],
                "correctAnswer": "By disbursing surplus energy previously stored in utility batteries",
                "explanation": "Paragraph 2 states they absorb surge generation during midday peaks and disburse power during twilight demand.",
                "difficulty": "B2",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "b2-cognitive-behavioral-therapy",
        "title": "Neuroplasticity and Cognitive Behavioral Reframing",
        "subtitle": "Reprogramming maladaptive neural pathways through evidence-based psychotherapy",
        "level": "B2",
        "topic": "Psychology & Health",
        "author": "Dr. Maya Lin",
        "estimatedMinutes": 4,
        "wordCount": 250,
        "coverImage": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "b2-cognitive-behavioral-therapy-p1",
                "order": 1,
                "english": "Historically, conventional psychiatry regarded the adult cerebral architecture as rigid and unalterable. Contemporary neuroimaging, however, conclusively demonstrates neuroplasticity: the brain's lifelong capacity to reorganize synaptic wiring in response to systematic behavioral stimuli.",
                "vietnamese": "Trước đây, tâm thần học cổ điển từng coi cấu trúc não bộ người trưởng thành là cố định và không thể biến đổi. Tuy nhiên, chẩn đoán hình ảnh thần kinh hiện đại đã chứng minh tính dẻo não bộ: khả năng suốt đời của bộ não trong việc tổ chức lại các liên kết synap nhằm đáp ứng các kích thích hành vi có hệ thống."
            },
            {
                "id": "b2-cognitive-behavioral-therapy-p2",
                "order": 2,
                "english": "Cognitive Behavioral Therapy (CBT) leverages this plasticity by training individuals to consciously intercept cognitive distortions such as catastrophizing and black-and-white thinking. Through deliberate cognitive restructuring, patients weaken chronic anxiety circuits and establish robust rational responses.",
                "vietnamese": "Liệu pháp Nhận thức - Hành vi (CBT) tận dụng tính dẻo này bằng cách huấn luyện các cá nhân chủ động ngăn chặn các sai lệch nhận thức như thảm họa hóa hay tư duy đen trắng. Qua việc tái cấu trúc nhận thức có chủ đích, người bệnh làm suy yếu các mạch lo âu mãn tính và hình thành phản ứng duy lý vững vàng."
            }
        ],
        "questions": [
            {
                "id": "b2-cognitive-behavioral-therapy-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "What groundbreaking scientific concept superseded the old belief that adult brains are fixed?",
                "options": ["Neuroplasticity", "Phrenology", "Trepanation", "Sensory deprivation"],
                "correctAnswer": "Neuroplasticity",
                "explanation": "Paragraph 1 explains that contemporary neuroimaging demonstrates neuroplasticity.",
                "difficulty": "B2",
                "relatedParagraph": 1
            },
            {
                "id": "b2-cognitive-behavioral-therapy-q2",
                "order": 2,
                "type": "vocabulary",
                "question": "In this context, what does 'catastrophizing' mean?",
                "options": ["Irrational mental habits anticipating worst-case disasters", "Studying geology after volcanic eruptions", "Building disaster shelters in mountains", "Fixing broken electrical equipment"],
                "correctAnswer": "Irrational mental habits anticipating worst-case disasters",
                "explanation": "Catastrophizing is cited as a cognitive distortion where individuals anticipate extreme negative outcomes.",
                "difficulty": "B2",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "b2-urban-vertical-farming",
        "title": "Aeroponics and the Ascent of Vertical Farming",
        "subtitle": "Cultivating pesticide-free crops within urban skyscraper ecosystems",
        "level": "B2",
        "topic": "Agriculture & Science",
        "author": "Marcus Sterling",
        "estimatedMinutes": 4,
        "wordCount": 240,
        "coverImage": "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "b2-urban-vertical-farming-p1",
                "order": 1,
                "english": "As arable agricultural acreage declines under climate stress and urban sprawl, controlled-environment agriculture offers a revolutionary spatial solution. By stacking crop cultivation tiers inside decommissioned industrial warehouses, vertical farms achieve staggering land productivity multiples.",
                "vietnamese": "Khi diện tích đất nông nghiệp canh tác suy giảm dưới tác động biến đổi khí hậu và đô thị hóa tràn lan, mô hình nông nghiệp môi trường có kiểm soát đem lại giải pháp không gian mang tính cách mạng. Bằng cách xếp tầng các giàn cây trồng bên trong nhà kho công nghiệp cũ, nông trại thẳng đứng đạt năng suất đất gấp nhiều lần."
            },
            {
                "id": "b2-urban-vertical-farming-p2",
                "order": 2,
                "english": "Advanced facilities implement closed-loop aeroponic misting systems that mist root structures directly with nutrient-infused water droplets. This methodology consumes ninety-five percent less water than conventional soil farming while eliminating synthetic chemical runoff entirely.",
                "vietnamese": "Các cơ sở tiên tiến ứng dụng hệ thống phun khí canh tuần hoàn khép kín, phun sương trực tiếp các giọt nước giàu dinh dưỡng vào cấu trúc rễ. Phương pháp này tiêu thụ ít hơn 95% lượng nước so với canh tác đất truyền thống và loại bỏ hoàn toàn dư lượng hóa chất tổng hợp rửa trôi."
            }
        ],
        "questions": [
            {
                "id": "b2-urban-vertical-farming-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "How much less water does aeroponic cultivation utilize compared to conventional farming?",
                "options": ["Ninety-five percent less", "Ten percent less", "The exact same amount", "Fifty percent more water"],
                "correctAnswer": "Ninety-five percent less",
                "explanation": "Paragraph 2 states this methodology consumes ninety-five percent less water.",
                "difficulty": "B2",
                "relatedParagraph": 2
            },
            {
                "id": "b2-urban-vertical-farming-q2",
                "order": 2,
                "type": "main-idea",
                "question": "What is the key advantage of vertical farming discussed in paragraph 1?",
                "options": ["Multiplying land yield efficiency through indoor vertical stacking", "Replacing all tractors with diesel trucks", "Importing tropical fruits from overseas", "Growing timber for construction companies"],
                "correctAnswer": "Multiplying land yield efficiency through indoor vertical stacking",
                "explanation": "Paragraph 1 highlights stacking crop tiers inside indoor warehouses to achieve high land productivity.",
                "difficulty": "B2",
                "relatedParagraph": 1
            }
        ]
    },
    {
        "id": "b2-circular-economy-textiles",
        "title": "Closing the Loop: Circular Textiles and Synthetic Recycling",
        "subtitle": "Engineering enzyme cascades to break down blended polyester and cotton fabrics",
        "level": "B2",
        "topic": "Environment & Fashion",
        "author": "Chloe Dupond",
        "estimatedMinutes": 4,
        "wordCount": 255,
        "coverImage": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "b2-circular-economy-textiles-p1",
                "order": 1,
                "english": "The global apparel industry churns out approximately one hundred billion garments annually, of which more than eighty percent end up incinerated or entombed in municipal landfills. The primary hurdle in textile recycling stems from ubiquitous poly-cotton fiber blends, which defy mechanical separation.",
                "vietnamese": "Ngành may mặc toàn cầu sản xuất khoảng 100 tỷ sản phẩm dệt may mỗi năm, trong đó hơn 80% kết thúc bằng việc bị thiêu hủy hoặc chôn lấp tại các bãi rác đô thị. Trở ngại hàng đầu trong tái chế dệt may bắt nguồn từ các sợi pha polyester-cotton phổ biến, vốn không thể tách cơ học."
            },
            {
                "id": "b2-circular-economy-textiles-p2",
                "order": 2,
                "english": "Biochemical engineers have engineered specialized bacterial enzymes that selectively depolymerize synthetic polyethylene terephthalate into virgin-quality monomers while leaving natural cellulose intact. This enzymatic cascade enables true fiber-to-fiber recycling without physical quality degradation.",
                "vietnamese": "Các kỹ sư sinh hóa đã chế tạo các enzyme vi khuẩn chuyên biệt có khả năng khử polyme hóa có chọn lọc polyester nhân tạo thành các đơn phân monomer có chất lượng như mới mà vẫn giữ nguyên cellulose tự nhiên. Chuỗi phản ứng enzyme này mở đường cho quy trình tái chế sợi-sang-sợi thực thụ mà không suy giảm chất lượng vật lý."
            }
        ],
        "questions": [
            {
                "id": "b2-circular-economy-textiles-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "Why have traditional recycling methods struggled with modern fashion garments?",
                "options": ["Mixed poly-cotton fiber blends resist mechanical separation", "Garments are too heavy for industrial shredders", "Synthetic fabrics dissolve instantly in clean water", "No one buys recycled polyester threads"],
                "correctAnswer": "Mixed poly-cotton fiber blends resist mechanical separation",
                "explanation": "Paragraph 1 states the primary hurdle stems from ubiquitous poly-cotton fiber blends which defy mechanical separation.",
                "difficulty": "B2",
                "relatedParagraph": 1
            },
            {
                "id": "b2-circular-economy-textiles-q2",
                "order": 2,
                "type": "inference",
                "question": "What is the key technological breakthrough enabling circular textile recycling?",
                "options": ["Bacterial enzymes that selectively break down synthetic monomers", "Burning blended fabrics at extremely high temperatures", "Shipping discarded clothing to deep oceanic trenches", "Spraying garments with heavy toxic lacquers"],
                "correctAnswer": "Bacterial enzymes that selectively break down synthetic monomers",
                "explanation": "Paragraph 2 highlights engineered bacterial enzymes that selectively depolymerize synthetic materials.",
                "difficulty": "B2",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "b2-microbiome-gut-brain-axis",
        "title": "The Gut-Brain Axis: Microbial Influences on Cognition",
        "subtitle": "How enteric bacteria synthesis of neurotransmitters regulates mood and neuroinflammation",
        "level": "B2",
        "topic": "Biology & Health",
        "author": "Dr. Julian Thorne",
        "estimatedMinutes": 4,
        "wordCount": 260,
        "coverImage": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "b2-microbiome-gut-brain-axis-p1",
                "order": 1,
                "english": "The gastrointestinal tract harbors over thirty trillion commensal microbes, constituting a multifaceted metabolic ecosystem. Recent biomedical investigations reveal that this intestinal microbiota interacts bidirectionally with the central nervous system via the vagus nerve and neuroendocrine signaling pathways.",
                "vietnamese": "Đường tiêu hóa chứa hơn ba mươi nghìn tỷ vi sinh vật hội sinh, tạo thành một hệ sinh thái chuyển hóa đa diện. Các nghiên cứu y sinh gần đây tiết lộ rằng hệ vi sinh đường ruột này tương tác hai chiều với hệ thần kinh trung ương thông qua dây thần kinh phế vị và các đường truyền tín hiệu thần kinh thể dịch."
            },
            {
                "id": "b2-microbiome-gut-brain-axis-p2",
                "order": 2,
                "english": "Remarkably, gut microbes produce over ninety percent of peripheral serotonin and substantial amounts of gamma-aminobutyric acid (GABA). Dysbiosis—an imbalance in gut microbial ecology—is now directly implicated in systemic neuroinflammation and depressive affective states.",
                "vietnamese": "Đáng chú ý, các vi sinh vật đường ruột sản xuất hơn 90% serotonin ngoại vi và lượng lớn axit gamma-aminobutyric (GABA). Tình trạng loạn khuẩn—sự mất cân bằng hệ sinh thái vi sinh vật đường ruột—hiện nay được liên hệ trực tiếp đến chứng viêm thần kinh toàn thân và các trạng thái trầm cảm u uất."
            }
        ],
        "questions": [
            {
                "id": "b2-microbiome-gut-brain-axis-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "Which major conduit mediates bidirectional communication between the gut microbiota and the central nervous system?",
                "options": ["The vagus nerve and neuroendocrine pathways", "The femoral artery exclusively", "The cochlear optic canal", "Lymphatic thoracic ducts alone"],
                "correctAnswer": "The vagus nerve and neuroendocrine pathways",
                "explanation": "Paragraph 1 identifies the vagus nerve and neuroendocrine signaling pathways as the bidirectional communication route.",
                "difficulty": "B2",
                "relatedParagraph": 1
            },
            {
                "id": "b2-microbiome-gut-brain-axis-q2",
                "order": 2,
                "type": "vocabulary",
                "question": "What does the term 'dysbiosis' describe in medical microbiology?",
                "options": ["An unhealthy imbalance in microbial ecology", "A sudden acceleration in bone mineral growth", "A rapid increase in red blood cell count", "The complete absence of water in tissues"],
                "correctAnswer": "An unhealthy imbalance in microbial ecology",
                "explanation": "Paragraph 2 defines dysbiosis as an imbalance in gut microbial ecology.",
                "difficulty": "B2",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "b2-fintech-financial-inclusion",
        "title": "Mobile FinTech and Global Financial Democratization",
        "subtitle": "Bypassing brick-and-mortar banking infrastructure with algorithmic micro-lending",
        "level": "B2",
        "topic": "Finance & Economics",
        "author": "Amina Al-Mansoor",
        "estimatedMinutes": 4,
        "wordCount": 250,
        "coverImage": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "b2-fintech-financial-inclusion-p1",
                "order": 1,
                "english": "Over one billion adults worldwide lack access to formal banking institutions, historically excluding them from capital loans, insured savings, and commercial credit history. Traditional retail banks avoided rural and impoverished enclaves due to prohibitive branch maintenance expenditures.",
                "vietnamese": "Hơn một tỷ người trưởng thành trên toàn cầu thiếu quyền tiếp cận các tổ chức ngân hàng chính thức, khiến họ trong lịch sử bị loại khỏi các khoản vay vốn, tiết kiệm có bảo hiểm và hồ sơ tín dụng thương mại. Các ngân hàng bán lẻ truyền thống thường né tránh các vùng nông thôn nghèo do chi phí vận hành chi nhánh quá cao."
            },
            {
                "id": "b2-fintech-financial-inclusion-p2",
                "order": 2,
                "english": "Mobile money protocols and algorithmic credit-scoring platforms have disrupted this status quo. By analyzing cellular telecommunication data and utility payment histories, FinTech apps extend micro-capital to informal entrepreneurs, fueling grassroots microeconomic development.",
                "vietnamese": "Các giao thức tiền tệ di động và nền tảng chấm điểm tín dụng thuật toán đã phá vỡ thế độc quyền này. Bằng cách phân tích dữ liệu viễn thông di động và lịch sử thanh toán tiền điện nước, các ứng dụng FinTech cấp nguồn vốn siêu nhỏ cho các tiểu thương phi chính thức, thúc đẩy phát triển kinh tế cơ sở."
            }
        ],
        "questions": [
            {
                "id": "b2-fintech-financial-inclusion-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "Why did legacy commercial banks historically shun remote rural populations?",
                "options": ["Prohibitive expenditures required to build and staff physical branches", "Lack of interest in earning interest on loans", "Strict national bans prohibiting financial services outside cities", "Cellular networks were already owned by central banks"],
                "correctAnswer": "Prohibitive expenditures required to build and staff physical branches",
                "explanation": "Paragraph 1 notes retail banks avoided rural enclaves due to prohibitive branch maintenance expenditures.",
                "difficulty": "B2",
                "relatedParagraph": 1
            },
            {
                "id": "b2-fintech-financial-inclusion-q2",
                "order": 2,
                "type": "inference",
                "question": "How do FinTech applications assess creditworthiness without formal tax returns?",
                "options": ["By evaluating cellular phone usage records and utility bill payments", "By requiring customers to deposit physical gold coins", "By interviewing immediate neighbors in person", "By selecting borrowers purely at random"],
                "correctAnswer": "By evaluating cellular phone usage records and utility bill payments",
                "explanation": "Paragraph 2 states they analyze cellular telecommunication data and utility payment histories.",
                "difficulty": "B2",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "b2-hyperloop-high-speed-transit",
        "title": "Pneumatic Evacuated Tubes: The Physics of Near-Vacuum Transit",
        "subtitle": "Eliminating air resistance and friction to achieve near-sonic surface travel",
        "level": "B2",
        "topic": "Engineering & Transport",
        "author": "Dieter Weiss",
        "estimatedMinutes": 4,
        "wordCount": 250,
        "coverImage": "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "b2-hyperloop-high-speed-transit-p1",
                "order": 1,
                "english": "Conventional high-speed railway networks confront an inescapable thermodynamic ceiling: aerodynamic drag increases proportionally with the cube of velocity. As trains exceed three hundred kilometers per hour, electricity consumption escalates exponentially to pierce atmospheric pressure.",
                "vietnamese": "Các mạng lưới đường sắt cao tốc truyền thống đối mặt với một giới hạn nhiệt động lực học không thể tránh khỏi: lực cản khí động học tăng theo tỷ lệ bậc ba của vận tốc. Khi tàu hỏa vượt quá 300 km/h, lượng điện tiêu thụ tăng vọt theo cấp số nhân nhằm xuyên thủng áp suất khí quyển."
            },
            {
                "id": "b2-hyperloop-high-speed-transit-p2",
                "order": 2,
                "english": "Vactrain and hyperloop architectures bypass this barrier by encapsulating maglev passenger capsules inside depressurized steel conduits maintained at near-vacuum states. Without friction or atmospheric resistance, capsules can theoretically coast at transonic velocities exceeding one thousand kilometers per hour with minimal continuous propulsion.",
                "vietnamese": "Các mô hình tàu chân không và hyperloop vượt qua rào cản này bằng cách đóng kín các toa xe đệm từ chở khách bên trong các đường ống thép giảm áp được duy trì ở trạng thái gần chân không. Khi không còn ma sát hay lực cản khí quyển, các toa tàu về mặt lý thuyết có thể lướt ở vận tốc cận âm vượt quá 1000 km/h với lực đẩy liên tục tối thiểu."
            }
        ],
        "questions": [
            {
                "id": "b2-hyperloop-high-speed-transit-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "What aerodynamic phenomenon severely limits conventional high-speed train velocities?",
                "options": ["Aerodynamic drag escalating with the cube of velocity", "Excessive engine oil freezing in warm weather", "Failure of steel rails to conduct electricity", "Atmospheric oxygen catching fire at high speeds"],
                "correctAnswer": "Aerodynamic drag escalating with the cube of velocity",
                "explanation": "Paragraph 1 states that aerodynamic drag increases proportionally with the cube of velocity.",
                "difficulty": "B2",
                "relatedParagraph": 1
            },
            {
                "id": "b2-hyperloop-high-speed-transit-q2",
                "order": 2,
                "type": "inference",
                "question": "Why can hyperloop capsules travel at near-sonic speeds with minimal energy?",
                "options": ["The near-vacuum environment eliminates air resistance and maglev eliminates mechanical friction", "They burn jet fuel inside open passenger cars", "They utilize nuclear fission reactors inside each cabin", "They are propelled by giant downward gravitational catapults"],
                "correctAnswer": "The near-vacuum environment eliminates air resistance and maglev eliminates mechanical friction",
                "explanation": "Paragraph 2 explains that near-vacuum conditions and magnetic levitation eliminate friction and atmospheric resistance.",
                "difficulty": "B2",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "b2-deep-sea-mining-ethics",
        "title": "Abyssal Extraction: The Ecological Dilemma of Seabed Mining",
        "subtitle": "Weighing clean-tech battery mineral demands against fragile benthic biodiversity",
        "level": "B2",
        "topic": "Environment & Policy",
        "author": "Dr. Sarah O'Connor",
        "estimatedMinutes": 4,
        "wordCount": 260,
        "coverImage": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "b2-deep-sea-mining-ethics-p1",
                "order": 1,
                "english": "The global energy transition hinges on unprecedented quantities of cobalt, nickel, and rare earth elements for electric vehicle traction batteries. Because terrestrial mineral reserves are fraught with geopolitical vulnerability and severe human rights violations, mining consortia are looking downward to the abyssal Clarion-Clipperton Zone.",
                "vietnamese": "Quá trình chuyển dịch năng lượng toàn cầu phụ thuộc vào khối lượng chưa từng có coban, niken và các nguyên tố đất hiếm cho pin xe điện. Vì các trữ lượng khoáng sản trên cạn luôn đối mặt với tính bấp bênh địa chính trị và vi phạm nhân quyền nghiêm trọng, các tập đoàn khai khoáng đang hướng xuống vùng biển sâu Clarion-Clipperton."
            },
            {
                "id": "b2-deep-sea-mining-ethics-p2",
                "order": 2,
                "english": "Resting four thousand meters beneath sea level, polymetallic nodules take millions of years to precipitate around microscopic bone fragments. Marine biologists warn that dragging heavy dredging tractors across the seafloor will pulverize endemic glass sponge habitats and generate suspended sediment plumes that disrupt pelagic food webs across oceans.",
                "vietnamese": "Nằm ở độ sâu 4.000 mét dưới mực nước biển, các kết hạch đa kim mất hàng triệu năm để kết tủa quanh các mảnh vụn xương hiển vi. Các nhà sinh vật biển cảnh báo rằng việc kéo các máy hút nạo vét nặng nề qua đáy biển sẽ nghiền nát môi trường sống của loài bọt biển thủy tinh đặc hữu và tạo ra các đám mây trầm tích lơ lửng làm gián đoạn chuỗi thức ăn đại dương trên quy mô toàn cầu."
            }
        ],
        "questions": [
            {
                "id": "b2-deep-sea-mining-ethics-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "What primary economic motivation drives corporations to explore abyssal seabed mining?",
                "options": ["Securing cobalt and nickel essential for electric vehicle batteries", "Hunting for sunken Spanish gold treasure fleets", "Extracting fresh drinking water for coastal desert cities", "Discovering oil deposits for steam locomotives"],
                "correctAnswer": "Securing cobalt and nickel essential for electric vehicle batteries",
                "explanation": "Paragraph 1 explains demand hinges on unprecedented quantities of cobalt and nickel for EV batteries.",
                "difficulty": "B2",
                "relatedParagraph": 1
            },
            {
                "id": "b2-deep-sea-mining-ethics-q2",
                "order": 2,
                "type": "multiple-choice",
                "question": "What severe environmental consequence do marine biologists fear most from benthic dredging?",
                "options": ["Destruction of endemic benthic fauna and extensive sediment plumes", "Boiling of equatorial surface ocean water", "Depletion of atmospheric carbon dioxide", "Sudden freezing of global sea currents"],
                "correctAnswer": "Destruction of endemic benthic fauna and extensive sediment plumes",
                "explanation": "Paragraph 2 warns dredging tractors will pulverize glass sponge habitats and generate sediment plumes.",
                "difficulty": "B2",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "b2-augmented-reality-surgery",
        "title": "Holographic Precision: Augmented Reality in Modern Neurosurgery",
        "subtitle": "Superimposing intraoperative 3D vascular reconstructions over surgical microscopes",
        "level": "B2",
        "topic": "Medicine & Technology",
        "author": "Dr. Kenji Sato",
        "estimatedMinutes": 4,
        "wordCount": 265,
        "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "b2-augmented-reality-surgery-p1",
                "order": 1,
                "english": "Intracranial neurosurgery requires sub-millimeter anatomical accuracy; misjudging the trajectory of an arterial aneurysm clip by a single millimeter can result in catastrophic ischemia or irreversible motor paralysis. Traditionally, neurosurgeons toggled their gaze back and forth between two-dimensional MRI scans and surgical cavities.",
                "vietnamese": "Phẫu thuật thần kinh trong sọ đòi hỏi độ chính xác giải phẫu đến từng phần mười milimet; phán đoán sai quỹ đạo của kẹp túi phình động mạch dù chỉ một milimet cũng có thể gây thiếu máu cục bộ nghiêm trọng hoặc liệt vận động vĩnh viễn. Theo cách truyền thống, các phẫu thuật viên phải liên tục đảo mắt qua lại giữa phim MRI 2D và hốc mổ."
            },
            {
                "id": "b2-augmented-reality-surgery-p2",
                "order": 2,
                "english": "Modern operating suites integrate augmented reality headsets that render real-time, holographic 3D vascular reconstructions directly onto the surgeon's retinas. By fusing pre-operative volumetric angiography with optical tracking, surgeons navigate complex cerebral parenchyma with radiographic transparency, substantially mitigating iatrogenic morbidity.",
                "vietnamese": "Các phòng mổ hiện đại ngày nay tích hợp kính thực tế tăng cường AR chiếu hình ảnh tái tạo mạch máu 3D ba chiều thời gian thực trực tiếp lên võng mạc của phẫu thuật viên. Bằng cách hợp nhất hình ảnh chụp mạch thể tích trước mổ với công nghệ theo dõi quang học, bác sĩ điều hướng qua mô não phức tạp với độ trong suốt như chụp X-quang, giảm thiểu đáng kể tai biến do phẫu thuật."
            }
        ],
        "questions": [
            {
                "id": "b2-augmented-reality-surgery-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "What major inconvenience characterized traditional neurosurgical operations?",
                "options": ["Constantly shifting vision between 2D monitor scans and the microscopic surgical field", "Operating without sterile surgical gowns or gloves", "Performing surgery entirely without anesthesia", "Inability to turn on lighting inside the operating theatre"],
                "correctAnswer": "Constantly shifting vision between 2D monitor scans and the microscopic surgical field",
                "explanation": "Paragraph 1 mentions neurosurgeons toggled their gaze back and forth between 2D MRI scans and surgical cavities.",
                "difficulty": "B2",
                "relatedParagraph": 1
            },
            {
                "id": "b2-augmented-reality-surgery-q2",
                "order": 2,
                "type": "inference",
                "question": "How does AR headset technology improve patient outcomes during complex neurosurgery?",
                "options": ["It overlays real-time 3D vascular maps directly onto the tissue to guide precision incisions", "It replaces the neurosurgeon with an automated robotic arm entirely", "It reduces surgery duration to under two minutes", "It eliminates the need to sterilize hospital tools"],
                "correctAnswer": "It overlays real-time 3D vascular maps directly onto the tissue to guide precision incisions",
                "explanation": "Paragraph 2 explains it renders real-time holographic 3D vascular reconstructions directly onto retinas to guide navigation.",
                "difficulty": "B2",
                "relatedParagraph": 2
            }
        ]
    }
]

c1_articles = [
    {
        "id": "c1-quantum-cryptography-post-rsa",
        "title": "Post-Quantum Cryptography and the Lattice-Based Paradigm",
        "subtitle": "Safeguarding sovereign communication infrastructures against Shor's algorithmic decimation",
        "level": "C1",
        "topic": "Computer Science & Cryptography",
        "author": "Dr. Evelyn Montgomery",
        "estimatedMinutes": 5,
        "wordCount": 310,
        "coverImage": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "c1-quantum-cryptography-post-rsa-p1",
                "order": 1,
                "english": "The foundational security architecture of global telecommunications rests upon asymmetric public-key cryptosystems, notably RSA and elliptic-curve cryptography. The mathematical intractability of these ciphers depends on the computational hardness of integer factorization and discrete logarithms on classical Von Neumann processors.",
                "vietnamese": "Kiến trúc an ninh nền tảng của viễn thông toàn cầu dựa trên các hệ mật mã khóa công khai bất đối xứng, tiêu biểu là RSA và mật mã đường cong elliptic. Tính bất khả kháng toán học của các thuật mã này phụ thuộc vào độ phức tạp tính toán của phép phân tích thừa số nguyên và logarit rời rạc trên các bộ xử lý Von Neumann cổ điển."
            },
            {
                "id": "c1-quantum-cryptography-post-rsa-p2",
                "order": 2,
                "english": "However, the realization of fault-tolerant quantum computers utilizing Shor's quantum algorithm will render these mathematical primitives obsolete within polynomial time. Cryptographic agencies are consequently orchestrating a systemic migration toward post-quantum standards, prominently lattice-based schemes like CRYSTALS-Kyber, whose shortest vector problems are believed to remain intractable even for quantum superpositions.",
                "vietnamese": "Tuy nhiên, sự hiện thực hóa của các máy tính lượng tử có khả năng chịu lỗi vận dụng thuật toán Shor sẽ biến các tiên đề toán học này thành lỗi thời trong thời gian đa thức. Các cơ quan mật mã học do đó đang tổ chức một cuộc chuyển đổi mang tính hệ thống sang các chuẩn hậu lượng tử, nổi bật là các phương án dựa trên mạng tinh thể (lattice) như CRYSTALS-Kyber, mà bài toán vectơ ngắn nhất của chúng được tin là vẫn bất khả giải ngay cả trước các trạng thái chồng chập lượng tử."
            }
        ],
        "questions": [
            {
                "id": "c1-quantum-cryptography-post-rsa-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "What mathematical vulnerability enables quantum computers to demolish traditional RSA encryption?",
                "options": ["Shor's algorithm can solve prime integer factorization in polynomial time", "Quantum computers have unlimited hard drive disk storage capacity", "Lattice structures dissolve when exposed to high temperatures", "Elliptic curves cannot be drawn on digital displays"],
                "correctAnswer": "Shor's algorithm can solve prime integer factorization in polynomial time",
                "explanation": "Paragraph 2 notes that Shor's algorithm renders integer factorization primitives obsolete within polynomial time.",
                "difficulty": "C1",
                "relatedParagraph": 2
            },
            {
                "id": "c1-quantum-cryptography-post-rsa-q2",
                "order": 2,
                "type": "inference",
                "question": "Why are lattice-based cryptographic algorithms considered resilient against quantum adversaries?",
                "options": ["Their shortest vector mathematical problems resist quantum algorithmic speedup", "They do not use mathematical calculations of any kind", "They operate strictly on analog copper telephone lines", "They require quantum computers to be turned off completely"],
                "correctAnswer": "Their shortest vector mathematical problems resist quantum algorithmic speedup",
                "explanation": "Paragraph 2 highlights that shortest vector problems in lattice schemes remain intractable for quantum superpositions.",
                "difficulty": "C1",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "c1-crispr-gene-drive-bioethics",
        "title": "CRISPR Gene Drives and Irreversible Ecological Editing",
        "subtitle": "Assessing the biocentric ethics of driving vector species to extinction",
        "level": "C1",
        "topic": "Bioethics & Genetics",
        "author": "Prof. Jean-Luc Moreau",
        "estimatedMinutes": 5,
        "wordCount": 320,
        "coverImage": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "c1-crispr-gene-drive-bioethics-p1",
                "order": 1,
                "english": "Synthetic gene drives engineered through CRISPR-Cas endonuclease cassettes circumvent classical Mendelian inheritance, perpetuating engineered genetic mutations to nearly one hundred percent of offspring. When applied to hematophagous vector populations like Anopheles gambiae, this mutagenic mechanism can intentionally propagate population collapse, effectively eradicating malaria transmissions.",
                "vietnamese": "Các ổ dẫn gen tổng hợp được thiết kế thông qua các đoạn nuclease CRISPR-Cas đã phá vỡ quy luật di truyền Men-đen cổ điển, truyền các đột biến di truyền nhân tạo cho gần 100% thế hệ con cái. Khi được áp dụng cho các quần thể muỗi hút máu truyền bệnh như Anopheles gambiae, cơ chế gây đột biến này có thể chủ động gây suy giảm quần thể, tiến tới xóa sổ sự lây truyền bệnh sốt rét."
            },
            {
                "id": "c1-crispr-gene-drive-bioethics-p2",
                "order": 2,
                "english": "Nevertheless, releasing self-propagating genetic alterations into uncontained wilderness environments introduces unprecedented ontological hazards. Ecological bioethicists underscore that purging a native taxon may destabilize trophic cascades, spur unforeseen niche occupancy by alternative pathogen vectors, and permanently infringe upon the evolutionary autonomy of wild biospheres.",
                "vietnamese": "Tuy nhiên, việc thả các biến đổi di truyền tự nhân bản vào môi trường tự nhiên mở đưa lại những hiểm họa bản thể học chưa từng có tiền lệ. Các nhà đạo đức sinh thái nhấn mạnh rằng việc xóa sổ một đơn vị phân loại bản địa có thể làm mất ổn định các mắt xích dinh dưỡng, tạo điều kiện cho các vector mang mầm bệnh khác chiếm lĩnh hốc sinh thái, và xâm phạm vĩnh viễn quyền tự chủ tiến hóa của sinh quyển hoang dã."
            }
        ],
        "questions": [
            {
                "id": "c1-crispr-gene-drive-bioethics-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "How do CRISPR synthetic gene drives deviate from standard Mendelian genetics?",
                "options": ["They pass target traits to nearly 100% of offspring instead of classical 50% ratios", "They only alter phenotype colors without changing DNA strands", "They require nuclear radiation to pass to subsequent generations", "They can only be passed from paternal grandparents"],
                "correctAnswer": "They pass target traits to nearly 100% of offspring instead of classical 50% ratios",
                "explanation": "Paragraph 1 states gene drives circumvent Mendelian inheritance, perpetuating mutations to nearly 100% of offspring.",
                "difficulty": "C1",
                "relatedParagraph": 1
            },
            {
                "id": "c1-crispr-gene-drive-bioethics-q2",
                "order": 2,
                "type": "main-idea",
                "question": "What is the primary bioethical peril of deploying irreversible gene drives in nature?",
                "options": ["Unpredictable trophic collapse and evolutionary disruption across open ecosystems", "The high financial cost of manufacturing glass pipettes", "The difficulty of breeding mosquitoes in clean laboratories", "The risk of mosquitoes acquiring human language capabilities"],
                "correctAnswer": "Unpredictable trophic collapse and evolutionary disruption across open ecosystems",
                "explanation": "Paragraph 2 emphasizes destabilized trophic cascades, niche occupancy by alternative vectors, and loss of evolutionary autonomy.",
                "difficulty": "C1",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "c1-algorithmic-governance-democracy",
        "title": "Algorithmic Governance and the Erosion of Epistemic Common Ground",
        "subtitle": "How hyper-personalized engagement loops polarize deliberation in civil society",
        "level": "C1",
        "topic": "Philosophy & Political Science",
        "author": "Dr. Tarik Sen",
        "estimatedMinutes": 5,
        "wordCount": 315,
        "coverImage": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "c1-algorithmic-governance-democracy-p1",
                "order": 1,
                "english": "Deliberative democratic legitimacy presumes a shared epistemic commons—a verifiable substratum of factual reality from which divergent political constituencies can negotiate consensus. The hegemony of engagement-maximizing recommendation systems has irrevocably fragmented this consensus by prioritizing affective outrage over factual veracity.",
                "vietnamese": "Tính chính danh của nền dân chủ thảo luận tiền giả định một không gian nhận thức chung—một tầng thực tại xác minh được làm điểm tựa để các cộng đồng chính trị khác nhau có thể thương lượng sự đồng thuận. Sự thống trị của các hệ thống khuyến nghị tối đa hóa tương tác đã làm phân mảnh không thể cứu vãn sự đồng thuận này bằng cách ưu tiên sự phẫn nộ cảm tính hơn tính chân thực của dữ kiện."
            },
            {
                "id": "c1-algorithmic-governance-democracy-p2",
                "order": 2,
                "english": "By algorithmically sealing individuals inside self-reinforcing confirmation bubbles, platforms incentivize epistemic closure. Political opponents are no longer perceived as fellow interlocutors holding different priorities, but rather as ontologically malignant adversaries, degrading democratic statecraft into zero-sum tribal warfare.",
                "vietnamese": "Bằng cách cô lập các cá nhân về mặt thuật toán bên trong những 'bong bóng' thiên kiến tự củng cố, các nền tảng thúc đẩy sự khép kín nhận thức. Những người bất đồng chính kiến không còn được coi là những người đối thoại cùng chí hướng với các ưu tiên khác nhau, mà biến thành những kẻ thù ác ý về mặt bản thể học, khiến nghệ thuật lãnh đạo dân chủ thoái hóa thành cuộc chiến bộ lạc mang tính triệt tiêu."
            }
        ],
        "questions": [
            {
                "id": "c1-algorithmic-governance-democracy-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "What fundamental prerequisite of deliberative democracy is eroded by recommendation feeds?",
                "options": ["A shared epistemic commons of agreed-upon factual reality", "The capability to print newspapers on paper", "The existence of televised political debates", "The requirement of physical polling booths"],
                "correctAnswer": "A shared epistemic commons of agreed-upon factual reality",
                "explanation": "Paragraph 1 notes that deliberative democracy presumes a shared epistemic commons, which engagement algorithms fragment.",
                "difficulty": "C1",
                "relatedParagraph": 1
            },
            {
                "id": "c1-algorithmic-governance-democracy-q2",
                "order": 2,
                "type": "vocabulary",
                "question": "What does the author imply by 'epistemic closure'?",
                "options": ["A state where closed minds reject all exterior verifiable evidence", "The closing of public libraries on weekends", "The graduation ceremony of university students", "A computer network undergoing a firewall shutdown"],
                "correctAnswer": "A state where closed minds reject all exterior verifiable evidence",
                "explanation": "Epistemic closure describes individuals sealed inside echo chambers who treat conflicting perspectives as hostile.",
                "difficulty": "C1",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "c1-astrobiology-europa-biosignatures",
        "title": "Cryovolcanism and Chemosynthetic Biosignatures on Europa",
        "subtitle": "Hydrothermal vent plumes and subglacial habitability in Jovian outer-moon oceans",
        "level": "C1",
        "topic": "Astrophysics & Astrobiology",
        "author": "Dr. Cassandra Vance",
        "estimatedMinutes": 5,
        "wordCount": 330,
        "coverImage": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "c1-astrobiology-europa-biosignatures-p1",
                "order": 1,
                "english": "Planetary scientists examining Jupiter's icy moon Europa have long recognized that tidal flexing driven by Jovian gravitational resonance sustains a liquid ocean beneath its twenty-kilometer ice shell. Containing more liquid brine than all of Earth's oceans combined, Europa's seafloor likely interfaces directly with a silicate mantle rich in serpentinizing hydrothermal vents.",
                "vietnamese": "Các nhà khoa học hành tinh nghiên cứu mặt trăng băng Europa của sao Mộc từ lâu đã nhận ra rằng lực uốn thủy triều do cộng hưởng hấp dẫn từ sao Mộc duy trì một đại dương lỏng dưới lớp vỏ băng dày 20 km. Chứa lượng nước mặn lỏng nhiều hơn tất cả các đại dương trên Trái đất cộng lại, đáy biển của Europa có thể tiếp xúc trực tiếp với lớp manti silicat giàu các miệng phun thủy nhiệt serpentin hóa."
            },
            {
                "id": "c1-astrobiology-europa-biosignatures-p2",
                "order": 2,
                "english": "Without sunlight for photosynthesis, any putative extraterrestrial biosphere must rely exclusively on chemosynthesis driven by abiotic radiolytic oxidants and hydrothermal electron donors like molecular hydrogen and methane. Detecting chiral amino acid enantiomer excesses within ejected cryovolcanic plumes would constitute smoking-gun evidence of extraterrestrial biochemical activity.",
                "vietnamese": "Không có ánh sáng mặt trời cho quang hợp, bất kỳ sinh quyển ngoài Trái đất giả định nào cũng phải phụ thuộc hoàn toàn vào hóa tổng hợp nhờ các chất oxy hóa phân rã phóng xạ phi sinh học và các chất cho electron thủy nhiệt như hydro phân tử và metan. Việc phát hiện sự vượt trội của các đối phân axit amin bất đối xứng bên trong các luồng phun núi lửa băng được phóng ra sẽ cấu thành bằng chứng đanh thép về hoạt động hóa sinh ngoài hành tinh."
            }
        ],
        "questions": [
            {
                "id": "c1-astrobiology-europa-biosignatures-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "What primary geophysical mechanism maintains Europa's vast subsurface liquid ocean?",
                "options": ["Tidal flexing driven by Jovian gravitational resonance", "Extreme solar radiation warming the outer crust", "Active volcanic burning of petroleum fuels", "Artificial heaters deployed by space probes"],
                "correctAnswer": "Tidal flexing driven by Jovian gravitational resonance",
                "explanation": "Paragraph 1 explains tidal flexing driven by Jovian gravitational resonance sustains a liquid ocean.",
                "difficulty": "C1",
                "relatedParagraph": 1
            },
            {
                "id": "c1-astrobiology-europa-biosignatures-q2",
                "order": 2,
                "type": "inference",
                "question": "Why would an excess of chiral amino acid enantiomers in ice plumes indicate alien life?",
                "options": ["Biochemical organisms selectively produce single-handed chiral molecules unlike abiotic synthesis", "Non-living rocks always produce perfect mirror symmetries in space", "Plumes only erupt when ignited by organic metabolic heat", "Chirality is a property exclusively found in liquid water"],
                "correctAnswer": "Biochemical organisms selectively produce single-handed chiral molecules unlike abiotic synthesis",
                "explanation": "Chiral amino acid enantiomer excesses indicate biological selectivity over random racemic abiotic chemical mixtures.",
                "difficulty": "C1",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "c1-cognitive-linguistics-embodiment",
        "title": "Embodied Cognition and the Spatialization of Metaphor",
        "subtitle": "How sensorimotor physical interactions govern abstract human conceptualization",
        "level": "C1",
        "topic": "Cognitive Linguistics",
        "author": "Prof. Arthur Pendelton",
        "estimatedMinutes": 5,
        "wordCount": 320,
        "coverImage": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "c1-cognitive-linguistics-embodiment-p1",
                "order": 1,
                "english": "Cartesian rationalism posited a dualistic paradigm wherein cognitive intellect operated in a disembodied, symbolic realm detached from corporeal biology. Conversely, pioneering cognitive linguists demonstrated that human conceptual reasoning is fundamentally grounded in embodied sensorimotor schemata derived from physical locomotion and environmental orientation.",
                "vietnamese": "Thuyết duy lý Descartes từng đưa ra mô hình nhị nguyên trong đó trí tuệ hoạt động trong một địa hạt biểu tượng phi thể xác, tách rời khỏi sinh học thể chất. Ngược lại, các nhà ngôn ngữ học nhận thức tiên phong đã chứng minh rằng tư duy khái niệm của con người về bản chất được bắt rễ từ các lược đồ cảm giác-vận động thể nhập, bắt nguồn từ sự vận động thể chất và định hướng môi trường."
            },
            {
                "id": "c1-cognitive-linguistics-embodiment-p2",
                "order": 2,
                "english": "Abstract domains such as temporality, morality, and social hierarchy are systematically conceptualized through primary orientational metaphors: time is experienced as a forward spatial trajectory, virtue as vertical height, and social influence as physical weight. Consequently, abstract semantics are not arbitrary syntax, but biological projections of bodily experience.",
                "vietnamese": "Các miền trừu tượng như thời gian, đạo đức và thứ bậc xã hội được khái niệm hóa một cách có hệ thống thông qua các ẩn dụ định hướng nguyên cấp: thời gian được trải nghiệm như quỹ đạo không gian phía trước, phẩm hạnh như chiều cao thẳng đứng, và sức ảnh hưởng xã hội như trọng lượng vật lý. Do đó, ngữ nghĩa trừu tượng không phải là cú pháp ngẫu nhiên, mà là sự phản chiếu sinh học của trải nghiệm thể xác."
            }
        ],
        "questions": [
            {
                "id": "c1-cognitive-linguistics-embodiment-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "Which intellectual doctrine did embodied cognition fundamentally challenge?",
                "options": ["Cartesian mind-body dualism", "Darwinian natural selection", "Einsteinian relativistic physics", "Freudian psychoanalysis"],
                "correctAnswer": "Cartesian mind-body dualism",
                "explanation": "Paragraph 1 contrasts embodied cognition with Cartesian rationalism's disembodied, symbolic realm.",
                "difficulty": "C1",
                "relatedParagraph": 1
            },
            {
                "id": "c1-cognitive-linguistics-embodiment-q2",
                "order": 2,
                "type": "inference",
                "question": "According to conceptual metaphor theory, why do humans visualize time moving 'forward'?",
                "options": ["Because bipedal forward locomotion forms the baseline experiential schema for progress", "Because clocks always rotate in a clockwise direction", "Because the Earth rotates toward the sun on its axis", "Because writing systems in all cultures move strictly left to right"],
                "correctAnswer": "Because bipedal forward locomotion forms the baseline experiential schema for progress",
                "explanation": "Paragraph 2 explains abstract semantics are biological projections of physical bodily experience and locomotion.",
                "difficulty": "C1",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "c1-macroeconomic-degrowth-paradigm",
        "title": "Steady-State Economics and the Degrowth Imperative",
        "subtitle": "Decoupling societal flourishing from infinite compound GDP expansion",
        "level": "C1",
        "topic": "Macroeconomics",
        "author": "Dr. Beatrice Dubois",
        "estimatedMinutes": 5,
        "wordCount": 315,
        "coverImage": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "c1-macroeconomic-degrowth-paradigm-p1",
                "order": 1,
                "english": "Neoclassical macroeconomics treats continuous gross domestic product growth as an inviolable proxy for human societal welfare. Yet compounding geometric growth on a thermodynamically closed biosphere inevitably transgresses planetary boundaries, driving acute biodiversity collapse and biogeochemical destabilization.",
                "vietnamese": "Kinh tế học vĩ mô tân cổ điển coi sự tăng trưởng tổng sản phẩm quốc nội liên tục là thước đo bất khả xâm phạm cho phúc lợi xã hội của loài người. Tuy nhiên, sự tăng trưởng hình học lũy tiến trên một sinh quyển đóng kín về mặt nhiệt động lực học chắc chắn sẽ vượt qua các ranh giới hành tinh, dẫn đến sự sụp đổ nghiêm trọng về đa dạng sinh học và mất ổn định chu trình sinh địa hóa."
            },
            {
                "id": "c1-macroeconomic-degrowth-paradigm-p2",
                "order": 2,
                "english": "The degrowth paradigm calls for an equitable, planned downscaling of energy and throughput in over-consuming nations. Rather than equating degrowth with recessionary austerity, proponents advocate universal public services, work-time reduction, and steady-state resource budgets that prioritize genuine human longevity and ecological homeostasis.",
                "vietnamese": "Mô hình phi tăng trưởng (degrowth) kêu gọi sự thu hẹp có kế hoạch và công bằng đối với năng lượng và lưu lượng vật chất ở các quốc gia tiêu thụ quá mức. Thay vì đánh đồng phi tăng trưởng với sự thắt lưng buộc bụng trong suy thoái, những người ủng hộ chủ trương phổ cập dịch vụ công, cắt giảm giờ làm và thiết lập ngân sách tài nguyên trạng thái tĩnh nhằm ưu tiên tuổi thọ con người đích thực cùng sự cân bằng sinh thái."
            }
        ],
        "questions": [
            {
                "id": "c1-macroeconomic-degrowth-paradigm-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "What fatal thermodynamic flaw does degrowth identify in perpetual GDP expansion?",
                "options": ["Infinite compound expansion cannot continue within a physically finite planetary biosphere", "Economic growth creates too much paper currency that weighs down bank vaults", "Workers eventually lose interest in spending their wages on leisure", "Machines will stop manufacturing goods when temperatures drop"],
                "correctAnswer": "Infinite compound expansion cannot continue within a physically finite planetary biosphere",
                "explanation": "Paragraph 1 notes compounding geometric growth on a thermodynamically closed biosphere inevitably transgresses planetary boundaries.",
                "difficulty": "C1",
                "relatedParagraph": 1
            },
            {
                "id": "c1-macroeconomic-degrowth-paradigm-q2",
                "order": 2,
                "type": "vocabulary",
                "question": "How do degrowth advocates distinguish their proposals from involuntary economic recessions?",
                "options": ["Degrowth is a planned, equitable realignment providing universal services, not chaotic austerity", "Recessions only occur during wartime while degrowth occurs in peace", "Degrowth completely abolishes money and banking systems immediately", "Recessions increase carbon emissions while degrowth burns coal"],
                "correctAnswer": "Degrowth is a planned, equitable realignment providing universal services, not chaotic austerity",
                "explanation": "Paragraph 2 emphasizes degrowth is a planned downscaling that provides universal services and work-time reduction rather than recessionary austerity.",
                "difficulty": "C1",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "c1-geoengineering-solar-radiation",
        "title": "Stratospheric Aerosol Injection: The Geoengineering Paradox",
        "subtitle": "Evaluating solar radiation management risks, monsoon disruption, and termination shock",
        "level": "C1",
        "topic": "Climate Science & Governance",
        "author": "Dr. Nathaniel Thorne",
        "estimatedMinutes": 5,
        "wordCount": 325,
        "coverImage": "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "c1-geoengineering-solar-radiation-p1",
                "order": 1,
                "english": "As anthropogenic greenhouse emissions continue to breach critical temperature tipping points, solar radiation management (SRM) has shifted from theoretical fringe to urgent geopolitical debate. Stratospheric aerosol injection simulates the cooling dynamics of massive plinian volcanic eruptions by dispersing sulfur dioxide into the upper atmosphere to deflect incident solar irradiance.",
                "vietnamese": "Khi lượng phát thải khí nhà kính do con người tiếp tục vượt qua các điểm bùng phát nhiệt độ tới hạn, quản lý bức xạ mặt trời (SRM) đã chuyển dịch từ lý thuyết ngoại vi sang chủ đề tranh luận địa chính trị cấp bách. Việc phun son khí vào tầng bình lưu mô phỏng cơ chế làm mát của các vụ phun trào núi lửa dạng Pliny khổng lồ bằng cách phân tán sulfur dioxide vào tầng khí quyển trên để làm chệch hướng bức xạ mặt trời chiếu tới."
            },
            {
                "id": "c1-geoengineering-solar-radiation-p2",
                "order": 2,
                "english": "While technically cost-effective, SRM presents catastrophic systemic hazards. Albedo manipulation threatens to disrupt equatorial monsoons, endangering food security for billions, while failing to address ocean acidification. Most perilously, the prospect of 'termination shock'—an abrupt cessation of aerosol delivery—would trigger rapid, catastrophic rebound warming rates unprecedented in geologic history.",
                "vietnamese": "Mặc dù hiệu quả về mặt chi phí kỹ thuật, SRM đưa lại những mối hiểm họa mang tính hệ thống khôn lường. Sự can thiệp suất phản chiếu có nguy cơ làm rối loạn các đợt gió mùa xích đạo, đe dọa an ninh lương thực của hàng tỷ người, đồng thời hoàn toàn bất lực trước nạn axit hóa đại dương. Nguy hiểm nhất là viễn cảnh 'cú sốc chấm dứt'—sự gián đoạn đột ngột của việc cung cấp son khí—sẽ châm ngòi cho tốc độ ấm lên bùng nổ thảm khốc chưa từng có trong lịch sử địa chất."
            }
        ],
        "questions": [
            {
                "id": "c1-geoengineering-solar-radiation-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "What natural phenomenon does stratospheric aerosol injection deliberately emulate?",
                "options": ["Plinian volcanic eruptions ejecting sulfur dioxide", "Tidal tsunamis flooding coastal regions", "Meteorite impacts creating desert craters", "Forest fires generating carbon soot"],
                "correctAnswer": "Plinian volcanic eruptions ejecting sulfur dioxide",
                "explanation": "Paragraph 1 states it simulates the cooling dynamics of massive plinian volcanic eruptions by dispersing sulfur dioxide.",
                "difficulty": "C1",
                "relatedParagraph": 1
            },
            {
                "id": "c1-geoengineering-solar-radiation-q2",
                "order": 2,
                "type": "vocabulary",
                "question": "What is meant by the concept of 'termination shock' in geoengineering discourse?",
                "options": ["Sudden, rapid rebound global warming if aerosol deployment is abruptly halted", "A massive electromagnetic pulse knocking out satellite communications", "The sudden freezing of polar ice caps into solid glaciers", "A legal shockwave when international treaties are signed"],
                "correctAnswer": "Sudden, rapid rebound global warming if aerosol deployment is abruptly halted",
                "explanation": "Paragraph 2 defines termination shock as abrupt cessation of aerosol delivery triggering rapid, catastrophic rebound warming.",
                "difficulty": "C1",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "c1-structural-connectomics-brain",
        "title": "High-Resolution Diffusion Tractography and Brain Connectomics",
        "subtitle": "Mapping the macro-scale structural wiring of the human cerebral connectome",
        "level": "C1",
        "topic": "Neuroscience",
        "author": "Dr. Viviane Mercier",
        "estimatedMinutes": 5,
        "wordCount": 320,
        "coverImage": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "c1-structural-connectomics-brain-p1",
                "order": 1,
                "english": "The human brain encompasses nearly eighty-six billion neurons interconnected by over one hundred trillion synaptic junctions. Deciphering this labyrinthine communicative infrastructure requires structural connectomics, which utilizes diffusion spectrum magnetic resonance imaging to track the Brownian motion of water molecules along myelinated axonal tracts.",
                "vietnamese": "Bộ não người chứa gần tám mươi sáu tỷ tế bào thần kinh được liên kết chằng chịt bởi hơn một trăm nghìn tỷ mối nối synap. Việc giải mã hạ tầng giao tiếp phức tạp như mê cung này đòi hỏi ngành kết nối học cấu trúc, bộ môn sử dụng chụp cộng hưởng từ phổ khuếch tán để theo dõi chuyển động Brown của các phân tử nước dọc theo các bó sợi trục có bao myelin."
            },
            {
                "id": "c1-structural-connectomics-brain-p2",
                "order": 2,
                "english": "Graph-theoretic mathematical analysis reveals that the cerebral connectome exhibits a 'rich-club' organization: a densely interconnected core of hub regions that facilitates rapid cross-modal cognitive integration. Disruption of these pivotal topological hubs correlates tightly with schizophrenia, Alzheimer's dementia, and intractable neurological disorders.",
                "vietnamese": "Phân tích toán học lý thuyết đồ thị tiết lộ rằng mạng lưới kết nối não bộ thể hiện một tổ chức 'câu lạc bộ giàu có' (rich-club): một vùng lõi gồm các trung tâm kết nối dày đặc giúp tạo điều kiện tích hợp nhận thức liên phương thức nhanh chóng. Sự gián đoạn của các trung tâm topo mang tính cốt lõi này tương quan chặt chẽ với bệnh tâm thần phân liệt, sa sút trí tuệ Alzheimer và các rối loạn thần kinh nan giải."
            }
        ],
        "questions": [
            {
                "id": "c1-structural-connectomics-brain-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "What physical principle does diffusion MRI tractography exploit to reconstruct axonal pathways?",
                "options": ["The anisotropic Brownian motion of water molecules along myelinated fibers", "The magnetic polarity of iron atoms inside red blood cells", "The emission of radioactive positrons from glucose tracers", "The reflective properties of acoustic ultrasound waves"],
                "correctAnswer": "The anisotropic Brownian motion of water molecules along myelinated fibers",
                "explanation": "Paragraph 1 explains it tracks the Brownian motion of water molecules along myelinated axonal tracts.",
                "difficulty": "C1",
                "relatedParagraph": 1
            },
            {
                "id": "c1-structural-connectomics-brain-q2",
                "order": 2,
                "type": "inference",
                "question": "What functional advantage does a 'rich-club' network architecture provide the human mind?",
                "options": ["Enables rapid cross-modal information integration across diverse cerebral regions", "Prevents electrical signals from traveling across hemispheres", "Isolates memory retrieval completely from visual perception", "Allows the brain to shut down ninety percent of neurons during daytime"],
                "correctAnswer": "Enables rapid cross-modal information integration across diverse cerebral regions",
                "explanation": "Paragraph 2 states the rich-club core facilitates rapid cross-modal cognitive integration.",
                "difficulty": "C1",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "c1-post-humanism-cybernetic-ontology",
        "title": "Cybernetic Ontology and the Disruption of Anthropocentrism",
        "subtitle": "Deconstructing humanist sovereignty in the era of hybrid techno-biological assemblages",
        "level": "C1",
        "topic": "Critical Theory & Philosophy",
        "author": "Prof. Sean Calloway",
        "estimatedMinutes": 5,
        "wordCount": 315,
        "coverImage": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "c1-post-humanism-cybernetic-ontology-p1",
                "order": 1,
                "english": "Enlightenment humanism codified the human subject as an autonomous, self-contained locus of rational sovereignty, demarcated sharply from inanimate technology and non-human organisms. Post-humanist philosophy demolishes this anthropocentric boundary, positing instead that subjectivity is an emergent property of hybrid cybernetic assemblages.",
                "vietnamese": "Chủ nghĩa nhân văn Khai sáng từng định hình chủ thể con người như một tâm điểm tự chủ, khép kín của chủ quyền duy lý, được phân định rạch ròi khỏi công nghệ vô tri và các sinh vật phi nhân bản. Triết học hậu nhân văn đã phá bỏ ranh giới vị nhân sinh này, khẳng định rằng tính chủ thể chỉ là một thuộc tính mới xuất hiện từ các tổ hợp mạng điều khiển lai tạo."
            },
            {
                "id": "c1-post-humanism-cybernetic-ontology-p2",
                "order": 2,
                "english": "From neuroprosthetic neural interfaces to algorithmic decision frameworks, agency is distributed across symbiotic feedback loops rather than residing in an isolated biological ego. Acknowledging this distributed ontology demands radical legal and ethical revisions regarding culpability, personhood, and biological stewardship.",
                "vietnamese": "Từ các giao diện thần kinh nhân tạo đến các khuôn khổ thuật toán ra quyết định, quyền năng chủ động được phân phối qua các vòng lặp phản hồi cộng sinh thay vì chỉ cư ngụ trong một cái tôi sinh học cô lập. Việc thừa nhận bản thể học phân tán này đòi hỏi những cuộc duyệt xét pháp lý và đạo đức căn bản về tính trách nhiệm, tư cách nhân thân và quyền quản trị sinh học."
            }
        ],
        "questions": [
            {
                "id": "c1-post-humanism-cybernetic-ontology-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "What central Enlightenment presumption does post-humanist theory critique?",
                "options": ["The view of the human being as an isolated, sovereign center of agency", "The idea that stars produce heat through nuclear fusion", "The invention of democratic constitutional voting systems", "The practice of medical immunization against infectious viruses"],
                "correctAnswer": "The view of the human being as an isolated, sovereign center of agency",
                "explanation": "Paragraph 1 contrasts post-humanism with Enlightenment humanism's autonomous, self-contained locus of rational sovereignty.",
                "difficulty": "C1",
                "relatedParagraph": 1
            },
            {
                "id": "c1-post-humanism-cybernetic-ontology-q2",
                "order": 2,
                "type": "inference",
                "question": "Where does agency reside according to modern cybernetic philosophy?",
                "options": ["Distributed across symbiotic feedback loops between humans and technologies", "Exclusively inside the human prefrontal cortex", "Inside silicon microprocessor chips without human involvement", "In divine supernatural decrees outside space and time"],
                "correctAnswer": "Distributed across symbiotic feedback loops between humans and technologies",
                "explanation": "Paragraph 2 states agency is distributed across symbiotic feedback loops rather than an isolated biological ego.",
                "difficulty": "C1",
                "relatedParagraph": 2
            }
        ]
    },
    {
        "id": "c1-anthropocene-stratigraphy",
        "title": "Technofossils and the Stratigraphic Golden Spike of the Anthropocene",
        "subtitle": "Reading humanity's enduring geochemical and radionuclide signatures in deep geological time",
        "level": "C1",
        "topic": "Geology & Earth Sciences",
        "author": "Dr. Helena Rostova",
        "estimatedMinutes": 5,
        "wordCount": 330,
        "coverImage": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=700&auto=format&fit=crop&q=80",
        "vocabularyIds": [],
        "paragraphs": [
            {
                "id": "c1-anthropocene-stratigraphy-p1",
                "order": 1,
                "english": "Geological epochs are formally demarcated by Global Boundary Stratotype Sections and Points (GSSPs)—commonly termed 'golden spikes'—identifying distinct, globally synchronous geochemical markers within sedimentary strata. Stratigraphers assessing whether humanity has inaugurated a distinct Anthropocene epoch examine clear perturbations in Earth's lithospheric record.",
                "vietnamese": "Các kỷ nguyên địa chất được phân định chính thức bởi các Điểm và Mặt cắt Tầng ranh giới Chuẩn Toàn cầu (GSSP)—thường được gọi là 'những chiếc đinh vàng'—nhận diện các dấu ấn địa hóa học đồng bộ trên toàn cầu bên trong các địa tầng trầm tích. Các nhà địa tầng học khi đánh giá xem liệu nhân loại đã mở ra một kỷ nguyên Nhân sinh (Anthropocene) riêng biệt hay chưa đang xem xét các biến động rõ nét trong hồ sơ thạch quyển Trái đất."
            },
            {
                "id": "c1-anthropocene-stratigraphy-p2",
                "order": 2,
                "english": "Compelling physical candidates include artificial radionuclide fallout from thermonuclear weapons tests beginning in 1952, ubiquitous technofossils composed of un-biodegradable plastics and elemental aluminum alloys, and drastic perturbations in carbon isotope ratios. These indelible lithic markers will remain clearly decipherable to extraterrestrial geologists hundreds of millions of years into the planet's future.",
                "vietnamese": "Những ứng viên vật lý thuyết phục bao gồm bụi phóng xạ hạt nhân nhân tạo từ các vụ thử vũ khí nhiệt hạch bắt đầu từ năm 1952, các hóa thạch kỹ thuật (technofossils) phổ biến tạo bởi nhựa không thể phân hủy sinh học và hợp kim nhôm nguyên tố, cùng sự biến động mạnh mẽ của tỷ lệ đồng vị carbon. Những dấu ấn thạch học không thể xóa nhòa này sẽ vẫn có thể được giải mã rõ ràng bởi các nhà địa chất ngoài hành tinh hàng trăm triệu năm nữa trong tương lai của hành tinh."
            }
        ],
        "questions": [
            {
                "id": "c1-anthropocene-stratigraphy-q1",
                "order": 1,
                "type": "multiple-choice",
                "question": "What is a 'golden spike' (GSSP) in official geological stratigraphy?",
                "options": ["A globally synchronous geochemical boundary marking the onset of a new geologic epoch", "A precious gold artifact buried by ancient Egyptian pharaohs", "A physical railway spike used to unite continental railway lines", "A measurement tool used to record volcanic earthquake tremors"],
                "correctAnswer": "A globally synchronous geochemical boundary marking the onset of a new geologic epoch",
                "explanation": "Paragraph 1 defines a golden spike (GSSP) as identifying distinct, globally synchronous geochemical markers within sedimentary strata.",
                "difficulty": "C1",
                "relatedParagraph": 1
            },
            {
                "id": "c1-anthropocene-stratigraphy-q2",
                "order": 2,
                "type": "inference",
                "question": "Which enduring material footprint qualifies as a 'technofossil' in humanity's stratigraphic record?",
                "options": ["Non-biodegradable plastics and elemental aluminum alloys", "Fossilized dinosaur footprints in limestone", "Volcanic basalt lava flows from prehistoric fissures", "Organic wooden tree leaves compressed into coal"],
                "correctAnswer": "Non-biodegradable plastics and elemental aluminum alloys",
                "explanation": "Paragraph 2 explicitly mentions ubiquitous technofossils composed of un-biodegradable plastics and aluminum alloys.",
                "difficulty": "C1",
                "relatedParagraph": 2
            }
        ]
    }
]

# Read existing file
with open("apps/api/src/data/readingExpandedData.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Find the closing bracket of EXPANDED_READING_ARTICLES
idx = content.rfind("];")
if idx == -1:
    print("Error: could not find closing bracket ]; in readingExpandedData.ts")
    exit(1)

# Format the 20 new articles to TS
all_new_articles = b2_articles + c1_articles

ts_fragments = []
for art in all_new_articles:
    ts_fragments.append(f"  {json.dumps(art, indent=2, ensure_ascii=False)},")

new_code = content[:idx].rstrip() + "\n" + "\n".join(ts_fragments) + "\n];\n"

with open("apps/api/src/data/readingExpandedData.ts", "w", encoding="utf-8") as f:
    f.write(new_code)

print(f"Successfully added {len(all_new_articles)} articles (10 B2 + 10 C1). Total in readingExpandedData.ts: 50.")
