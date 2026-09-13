import { Exam } from '../../../../packages/domain/src/index.js';

export const EXPANDED_EXAMS: Exam[] = [
  {
    "id": "exam-toeic-02",
    "title": "TOEIC Official Format Mock Test 02",
    "subtitle": "Complete Listening (Part 1, 2) & Reading (Part 5, 6, 7) Simulation",
    "type": "toeic",
    "difficulty": "B2",
    "durationMinutes": 60,
    "totalQuestions": 20,
    "maxScore": 990,
    "tags": [
      "toeic",
      "ets",
      "listening",
      "reading",
      "business-english"
    ],
    "isOfficialMock": true,
    "coverImage": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&auto=format&fit=crop&q=80",
    "sections": [
      {
        "id": "sec-toeic02-l1",
        "title": "Section 1: Listening Comprehension (Part 1 & 2)",
        "type": "listening",
        "durationMinutes": 20,
        "audioUrl": "https://cdn.linguaflow.com/audio/toeic_test02_listening.mp3",
        "questions": [
          {
            "id": "t2-l1-q1",
            "sectionId": "sec-toeic02-l1",
            "type": "listening-comprehension",
            "prompt": "Look at the photo and choose the statement that best describes what you see.",
            "audioText": "A woman is typing on a laptop keyboard beside a cup of coffee on an outdoor patio table.",
            "options": [
              "A woman is typing on a computer outdoors.",
              "She is ordering lunch from a waiter.",
              "The table is being cleaned by a busboy.",
              "The laptop screen is completely turned off."
            ],
            "correctAnswer": "A woman is typing on a computer outdoors.",
            "explanation": "The photo portrays a businesswoman working on her laptop on an outdoor patio.",
            "difficulty": "A2",
            "tags": [
              "part1",
              "photographs"
            ],
            "vocabularyIds": [
              "vocab-typing",
              "vocab-laptop"
            ]
          },
          {
            "id": "t2-l1-q2",
            "sectionId": "sec-toeic02-l1",
            "type": "listening-comprehension",
            "prompt": "Look at the photo and choose the statement that best describes what you see.",
            "audioText": "Forklift operators are stacking wooden pallets inside a commercial shipping warehouse.",
            "options": [
              "Some pallets are being stacked in a warehouse.",
              "The warehouse floor is being swept clean.",
              "Workers are painting the industrial ceiling.",
              "The trucks are leaving the loading dock."
            ],
            "correctAnswer": "Some pallets are being stacked in a warehouse.",
            "explanation": "The image shows warehouse operations with stacked wooden pallets.",
            "difficulty": "B1",
            "tags": [
              "part1",
              "photographs"
            ]
          },
          {
            "id": "t2-l1-q3",
            "sectionId": "sec-toeic02-l1",
            "type": "listening-comprehension",
            "prompt": "Who is responsible for organizing the annual regional sales summit?",
            "audioText": "Who is responsible for organizing the annual regional sales summit?",
            "options": [
              "Ms. Kapoor in the marketing department.",
              "Yes, it will take place next November.",
              "At the grand convention ballroom."
            ],
            "correctAnswer": "Ms. Kapoor in the marketing department.",
            "explanation": "'Who' asks for a responsible person, which is Ms. Kapoor.",
            "difficulty": "B1",
            "tags": [
              "part2",
              "question-response"
            ]
          },
          {
            "id": "t2-l1-q4",
            "sectionId": "sec-toeic02-l1",
            "type": "listening-comprehension",
            "prompt": "Could you help me troubleshoot this printer network error?",
            "audioText": "Could you help me troubleshoot this printer network error?",
            "options": [
              "Sure, let me check the cable connection first.",
              "Fifty pages per minute.",
              "On the second floor near the elevator."
            ],
            "correctAnswer": "Sure, let me check the cable connection first.",
            "explanation": "An affirmative offer to help solve the technical issue.",
            "difficulty": "B1",
            "tags": [
              "part2",
              "question-response"
            ]
          },
          {
            "id": "t2-l1-q5",
            "sectionId": "sec-toeic02-l1",
            "type": "listening-comprehension",
            "prompt": "When will the overseas supplier ship the replacement components?",
            "audioText": "When will the overseas supplier ship the replacement components?",
            "options": [
              "They promised to dispatch them by Wednesday morning.",
              "Because the original shipment was damaged.",
              "Directly by express air freight courier."
            ],
            "correctAnswer": "They promised to dispatch them by Wednesday morning.",
            "explanation": "'When' asks for a time frame, answered by Wednesday morning.",
            "difficulty": "B1",
            "tags": [
              "part2",
              "question-response"
            ]
          }
        ]
      },
      {
        "id": "sec-toeic02-r5",
        "title": "Section 2: Reading Incomplete Sentences (Part 5)",
        "type": "reading",
        "durationMinutes": 15,
        "questions": [
          {
            "id": "t2-r5-q1",
            "sectionId": "sec-toeic02-r5",
            "type": "multiple-choice",
            "prompt": "All employees are required to submit their quarterly expense reports _______ Friday afternoon.",
            "options": [
              "prior",
              "before",
              "ahead",
              "earlier"
            ],
            "correctAnswer": "before",
            "explanation": "'Before' acts as a preposition followed by the time noun phrase 'Friday afternoon'. 'Prior' requires 'to'.",
            "difficulty": "B1",
            "tags": [
              "part5",
              "prepositions"
            ]
          },
          {
            "id": "t2-r5-q2",
            "sectionId": "sec-toeic02-r5",
            "type": "multiple-choice",
            "prompt": "Mr. Henderson's _______ presentation convinced the executive board to approve the expansion budget.",
            "options": [
              "persuade",
              "persuasion",
              "persuasive",
              "persuasively"
            ],
            "correctAnswer": "persuasive",
            "explanation": "An adjective is required to modify the noun 'presentation'.",
            "difficulty": "B1",
            "tags": [
              "part5",
              "word-form"
            ]
          },
          {
            "id": "t2-r5-q3",
            "sectionId": "sec-toeic02-r5",
            "type": "multiple-choice",
            "prompt": "The automated quality inspection system operates _______ during overnight manufacturing shifts.",
            "options": [
              "dependable",
              "dependably",
              "dependability",
              "depended"
            ],
            "correctAnswer": "dependably",
            "explanation": "An adverb is required to modify the intransitive verb 'operates'.",
            "difficulty": "B2",
            "tags": [
              "part5",
              "adverbs"
            ]
          },
          {
            "id": "t2-r5-q4",
            "sectionId": "sec-toeic02-r5",
            "type": "multiple-choice",
            "prompt": "Unless authorized in writing by the facility director, visitor access to the cleanroom laboratory is strictly _______.",
            "options": [
              "prohibited",
              "prohibits",
              "prohibiting",
              "prohibition"
            ],
            "correctAnswer": "prohibited",
            "explanation": "Passive voice construction: 'is strictly prohibited'.",
            "difficulty": "B2",
            "tags": [
              "part5",
              "passive-voice"
            ]
          },
          {
            "id": "t2-r5-q5",
            "sectionId": "sec-toeic02-r5",
            "type": "multiple-choice",
            "prompt": "The merger between Apex Telecom and Veloce Networks was finalized _______ several months of regulatory scrutiny.",
            "options": [
              "after",
              "between",
              "during",
              "while"
            ],
            "correctAnswer": "after",
            "explanation": "'After' indicates the completion following the time duration 'several months of regulatory scrutiny'.",
            "difficulty": "B2",
            "tags": [
              "part5",
              "prepositions"
            ]
          }
        ]
      },
      {
        "id": "sec-toeic02-r6",
        "title": "Section 3: Text Completion (Part 6)",
        "type": "reading",
        "durationMinutes": 10,
        "passage": "MEMORANDUM\nTo: All Corporate Staff\nFrom: Facilities Management\nDate: October 14\nSubject: Scheduled Office HVAC Upgrades\n\nPlease be advised that our building heating and ventilation system will undergo comprehensive scheduled maintenance this coming weekend. [1] _______, the main air conditioning units will be decommissioned starting Friday at 6:00 PM. Engineering contractors anticipate that all installations will be completed [2] _______ Sunday evening. Staff members who plan to access the facility over the weekend are advised that ambient temperatures may be higher than usual. We appreciate your patience as we work to [3] _______ energy efficiency throughout the headquarters. [4] _______.",
        "questions": [
          {
            "id": "t2-r6-q1",
            "sectionId": "sec-toeic02-r6",
            "type": "multiple-choice",
            "prompt": "Choose the best transition word for blank [1]:",
            "options": [
              "Consequently",
              "Similarly",
              "Nevertheless",
              "Otherwise"
            ],
            "correctAnswer": "Consequently",
            "explanation": "'Consequently' expresses the cause-and-effect relationship resulting from the scheduled maintenance.",
            "difficulty": "B2",
            "tags": [
              "part6",
              "discourse-markers"
            ]
          },
          {
            "id": "t2-r6-q2",
            "sectionId": "sec-toeic02-r6",
            "type": "multiple-choice",
            "prompt": "Choose the correct preposition for blank [2]:",
            "options": [
              "by",
              "at",
              "on",
              "in"
            ],
            "correctAnswer": "by",
            "explanation": "'By' indicates a deadline before which the installation will be completed.",
            "difficulty": "B1",
            "tags": [
              "part6",
              "prepositions"
            ]
          },
          {
            "id": "t2-r6-q3",
            "sectionId": "sec-toeic02-r6",
            "type": "multiple-choice",
            "prompt": "Choose the most suitable verb for blank [3]:",
            "options": [
              "enhance",
              "resemble",
              "postpone",
              "discard"
            ],
            "correctAnswer": "enhance",
            "explanation": "'Enhance energy efficiency' is a natural collocation for upgrading building facilities.",
            "difficulty": "B2",
            "tags": [
              "part6",
              "vocabulary"
            ]
          },
          {
            "id": "t2-r6-q4",
            "sectionId": "sec-toeic02-r6",
            "type": "multiple-choice",
            "prompt": "Choose the sentence that best fits blank [4]:",
            "options": [
              "Normal building operations will resume promptly on Monday morning at 7:00 AM.",
              "Please submit all travel reimbursement vouchers to accounting.",
              "The company cafeteria will offer discounted sandwiches today.",
              "Parking fees will increase starting next fiscal quarter."
            ],
            "correctAnswer": "Normal building operations will resume promptly on Monday morning at 7:00 AM.",
            "explanation": "This sentence logically concludes the facilities maintenance announcement regarding when normal operations restart.",
            "difficulty": "B2",
            "tags": [
              "part6",
              "sentence-insertion"
            ]
          }
        ]
      },
      {
        "id": "sec-toeic02-r7",
        "title": "Section 4: Reading Comprehension (Part 7)",
        "type": "reading",
        "durationMinutes": 15,
        "passage": "EMAIL COMMUNICATION\nFrom: c.vance@nexuslogistics.com\nTo: k.yamamoto@orientmanufacturing.jp\nDate: November 3\nSubject: Revised Shipping Itinerary for Order #8841\n\nDear Mr. Yamamoto,\n\nI am writing to notify you of an itinerary update regarding container shipment #8841 containing precision CNC lathe components. Due to severe gale-force typhoons in the South China Sea, our vessel 'Pacific Voyager' was rerouted via the Makassar Strait to ensure navigational safety.\n\nWhile the detour delayed arrival by 48 hours, the vessel has now docked securely at Port Klang, Malaysia for refueling. Customs clearance is currently proceeding without friction. We project final berthing at Yokohama Container Terminal on November 12 rather than November 10. As stipulated in our corporate service-level guarantee, Nexus Logistics will waive all terminal handling surcharges to compensate for this weather delay.\n\nSincerely,\nCassandra Vance\nSenior Director of Maritime Operations\nNexus Logistics Global",
        "questions": [
          {
            "id": "t2-r7-q1",
            "sectionId": "sec-toeic02-r7",
            "type": "reading-comprehension",
            "prompt": "Why was the vessel 'Pacific Voyager' rerouted?",
            "options": [
              "Severe typhoon weather conditions threatened navigational safety.",
              "Engine breakdowns required drydock repairs in Singapore.",
              "The cargo was rejected by customs authorities.",
              "Port Klang was closed for emergency dredging."
            ],
            "correctAnswer": "Severe typhoon weather conditions threatened navigational safety.",
            "explanation": "Paragraph 1 states the vessel was rerouted due to severe gale-force typhoons.",
            "difficulty": "B2",
            "tags": [
              "part7",
              "detail"
            ]
          },
          {
            "id": "t2-r7-q2",
            "sectionId": "sec-toeic02-r7",
            "type": "reading-comprehension",
            "prompt": "When is the shipment now anticipated to arrive in Yokohama?",
            "options": [
              "November 12",
              "November 3",
              "November 10",
              "November 14"
            ],
            "correctAnswer": "November 12",
            "explanation": "Paragraph 2 states final berthing is projected on November 12 rather than November 10.",
            "difficulty": "B1",
            "tags": [
              "part7",
              "detail"
            ]
          },
          {
            "id": "t2-r7-q3",
            "sectionId": "sec-toeic02-r7",
            "type": "reading-comprehension",
            "prompt": "How will Nexus Logistics compensate the client for the transit delay?",
            "options": [
              "By waiving all terminal handling surcharges.",
              "By offering a fifty percent discount on the next purchase.",
              "By flying the remaining goods via cargo aircraft.",
              "By refunding the entire purchase price."
            ],
            "correctAnswer": "By waiving all terminal handling surcharges.",
            "explanation": "Paragraph 2 states Nexus Logistics will waive all terminal handling surcharges.",
            "difficulty": "B2",
            "tags": [
              "part7",
              "detail"
            ]
          },
          {
            "id": "t2-r7-q4",
            "sectionId": "sec-toeic02-r7",
            "type": "reading-comprehension",
            "prompt": "In the email, the word 'stipulated' in paragraph 2 is closest in meaning to:",
            "options": [
              "specified",
              "assumed",
              "denied",
              "cancelled"
            ],
            "correctAnswer": "specified",
            "explanation": "'Stipulated' means stated clearly or specified as part of a formal agreement.",
            "difficulty": "B2",
            "tags": [
              "part7",
              "vocabulary-context"
            ]
          },
          {
            "id": "t2-r7-q5",
            "sectionId": "sec-toeic02-r7",
            "type": "reading-comprehension",
            "prompt": "What can be inferred about Mr. Yamamoto?",
            "options": [
              "He is a client expecting delivery of manufacturing machinery components.",
              "He is the captain of the vessel Pacific Voyager.",
              "He works as a customs officer at Port Klang.",
              "He is an insurance adjuster investigating cargo damage."
            ],
            "correctAnswer": "He is a client expecting delivery of manufacturing machinery components.",
            "explanation": "The email addresses him regarding Order #8841 containing precision CNC lathe components for his company Orient Manufacturing.",
            "difficulty": "B2",
            "tags": [
              "part7",
              "inference"
            ]
          },
          {
            "id": "t2-r7-q6",
            "sectionId": "sec-toeic02-r7",
            "type": "reading-comprehension",
            "prompt": "Where is the Pacific Voyager docked at the time the email was sent?",
            "options": [
              "Port Klang, Malaysia",
              "Yokohama, Japan",
              "South China Sea",
              "Makassar Strait"
            ],
            "correctAnswer": "Port Klang, Malaysia",
            "explanation": "Paragraph 2 explicitly confirms the vessel has docked securely at Port Klang, Malaysia for refueling.",
            "difficulty": "B1",
            "tags": [
              "part7",
              "detail"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "exam-vstep-c1",
    "title": "VSTEP B2-C1 Proficiency Mock Test",
    "subtitle": "Language Use (Lexico-Grammar) & In-Depth Academic Reading",
    "type": "vstep",
    "difficulty": "C1",
    "durationMinutes": 60,
    "totalQuestions": 15,
    "maxScore": 10,
    "tags": [
      "vstep",
      "b2-c1",
      "vietnam-standard",
      "reading",
      "academic"
    ],
    "isOfficialMock": true,
    "coverImage": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=700&auto=format&fit=crop&q=80",
    "sections": [
      {
        "id": "sec-vstep02-lang",
        "title": "Section 1: Language Form and Lexico-Grammar",
        "type": "language",
        "durationMinutes": 20,
        "questions": [
          {
            "id": "v-lang-q1",
            "sectionId": "sec-vstep02-lang",
            "type": "multiple-choice",
            "prompt": "Hardly _______ the podium when thunderous applause echoed across the amphitheater.",
            "options": [
              "he had mounted",
              "had he mounted",
              "did he mount",
              "has he mounted"
            ],
            "correctAnswer": "had he mounted",
            "explanation": "Negative inversion structure: 'Hardly had + Subject + Past Participle... when'.",
            "difficulty": "C1",
            "tags": [
              "inversion",
              "grammar"
            ]
          },
          {
            "id": "v-lang-q2",
            "sectionId": "sec-vstep02-lang",
            "type": "multiple-choice",
            "prompt": "The dean insisted that every dissertation _______ by the ethics committee prior to defense.",
            "options": [
              "is reviewed",
              "be reviewed",
              "was reviewed",
              "must review"
            ],
            "correctAnswer": "be reviewed",
            "explanation": "Subjunctive mood after verbs of demand/insistence: 'insist that + Subject + bare infinitive (be reviewed)'.",
            "difficulty": "B2",
            "tags": [
              "subjunctive",
              "grammar"
            ]
          },
          {
            "id": "v-lang-q3",
            "sectionId": "sec-vstep02-lang",
            "type": "multiple-choice",
            "prompt": "The candidate's evasive responses were totally _______ with his self-proclaimed transparency.",
            "options": [
              "at odds",
              "in terms",
              "by virtue",
              "on par"
            ],
            "correctAnswer": "at odds",
            "explanation": "Idiomatic collocation 'at odds with' signifies in stark disagreement or conflict with something.",
            "difficulty": "C1",
            "tags": [
              "idioms",
              "vocabulary"
            ]
          },
          {
            "id": "v-lang-q4",
            "sectionId": "sec-vstep02-lang",
            "type": "multiple-choice",
            "prompt": "The rapid proliferation of deepfake videos poses an _______ hazard to election integrity.",
            "options": [
              "unprecedented",
              "involuntary",
              "ambivalent",
              "impertinent"
            ],
            "correctAnswer": "unprecedented",
            "explanation": "'Unprecedented' means never having happened or existed in the past.",
            "difficulty": "C1",
            "tags": [
              "collocations",
              "vocabulary"
            ]
          },
          {
            "id": "v-lang-q5",
            "sectionId": "sec-vstep02-lang",
            "type": "multiple-choice",
            "prompt": "_______ for the prompt intervention of the volunteer lifeguards, the swimmers would have drowned.",
            "options": [
              "Had it not been",
              "Were it not",
              "If it was not",
              "Had not it been"
            ],
            "correctAnswer": "Had it not been",
            "explanation": "Inversion for past unreal conditional: 'Had it not been for + Noun phrase...'.",
            "difficulty": "C1",
            "tags": [
              "inversion",
              "conditionals"
            ]
          }
        ]
      },
      {
        "id": "sec-vstep02-r1",
        "title": "Section 2: Academic Reading Comprehension",
        "type": "reading",
        "durationMinutes": 40,
        "passage": "THE NEUROBIOLOGY OF DECISION FATIGUE\n\nEvery day, the modern individual is inundated with an estimated thirty-five thousand distinct decisions, ranging from trivial wardrobe selections to high-stakes investment choices. Cognitive psychologists have long posited that self-regulatory volition and decision-making draw upon a finite, exhaustible neuro-metabolic reserve—a phenomenon designated as 'ego depletion' or decision fatigue.\n\nAt the neurochemical level, deliberate executive decision-making requires intensive glucose consumption within the prefrontal cortex. As individuals navigate continuous trade-offs throughout an uninterrupted workday, prefrontal glucose metabolism declines, impairing high-order executive functioning. Rather than continuing to painstakingly evaluate probabilistic risks and long-term consequences, a fatigued brain defaults to cognitive shortcuts: either reckless impulsivity or chronic procrastination.\n\nA landmark judicial study analyzing over one thousand parole rulings demonstrated the stark socio-legal repercussions of this cognitive ceiling. Prisoners appearing before judges in early morning sessions enjoyed favorable parole verdicts roughly sixty-five percent of the time. Conversely, as judicial sessions wore on toward late morning, the favorable rate plummeted nearly to zero before spiking again immediately after the judges took a lunch break to replenish physical energy. Faced with mental exhaustion, magistrates defaulted to the safest, lowest-effort ruling: rejecting parole.\n\nCounteracting decision fatigue requires deliberate environmental architecture. High-performing corporate leaders systematically eliminate low-value decisions—exemplified by famous minimal wardrobes—while reserving early morning hours for cognitively demanding strategic deliberation. Institutional recognition of cognitive ceilings is increasingly reshaping workplace design, driving the adoption of compulsory interval breaks and asynchronous decision workflows.",
        "questions": [
          {
            "id": "v-r1-q1",
            "sectionId": "sec-vstep02-r1",
            "type": "reading-comprehension",
            "prompt": "What is the primary thesis of the passage regarding decision fatigue?",
            "options": [
              "Continuous decision-making exhausts a finite cognitive metabolic reserve, degrading executive judgment.",
              "Judges are naturally corrupt and intentionally harm prison inmates.",
              "Human beings make identical quality choices regardless of mental tiredness.",
              "People should avoid making any decisions in the morning."
            ],
            "correctAnswer": "Continuous decision-making exhausts a finite cognitive metabolic reserve, degrading executive judgment.",
            "explanation": "Paragraph 1 and 2 establish that decision-making draws upon a finite neuro-metabolic reserve, degrading executive functioning.",
            "difficulty": "B2",
            "tags": [
              "main-idea"
            ]
          },
          {
            "id": "v-r1-q2",
            "sectionId": "sec-vstep02-r1",
            "type": "reading-comprehension",
            "prompt": "According to paragraph 2, what neurochemical mechanism underpins prefrontal decision fatigue?",
            "options": [
              "Decline in glucose consumption within the prefrontal cortex.",
              "Excessive production of adrenaline in the heart.",
              "A permanent reduction in skull volume.",
              "The complete death of all brain neurons."
            ],
            "correctAnswer": "Decline in glucose consumption within the prefrontal cortex.",
            "explanation": "Paragraph 2 explicitly states that prefrontal glucose metabolism declines under continuous trade-offs.",
            "difficulty": "C1",
            "tags": [
              "detail"
            ]
          },
          {
            "id": "v-r1-q3",
            "sectionId": "sec-vstep02-r1",
            "type": "reading-comprehension",
            "prompt": "What did the landmark judicial study reveal about parole grant rates?",
            "options": [
              "Favorable parole rates dropped from 65% in early morning to near zero before lunch.",
              "Parole was granted exclusively on Friday afternoons.",
              "Judges granted parole 100% of the time after reading complex files.",
              "Prisoners with lawyers were always rejected."
            ],
            "correctAnswer": "Favorable parole rates dropped from 65% in early morning to near zero before lunch.",
            "explanation": "Paragraph 3 documents early morning approvals at 65% dropping to nearly zero before spiking after a meal break.",
            "difficulty": "B2",
            "tags": [
              "detail"
            ]
          },
          {
            "id": "v-r1-q4",
            "sectionId": "sec-vstep02-r1",
            "type": "reading-comprehension",
            "prompt": "In paragraph 2, the word 'inundated' is closest in meaning to:",
            "options": [
              "overwhelmed",
              "abandoned",
              "entertained",
              "purified"
            ],
            "correctAnswer": "overwhelmed",
            "explanation": "'Inundated' literally means flooded and metaphorically means overwhelmed by excessive volume.",
            "difficulty": "C1",
            "tags": [
              "vocabulary-context"
            ]
          },
          {
            "id": "v-r1-q5",
            "sectionId": "sec-vstep02-r1",
            "type": "reading-comprehension",
            "prompt": "Why do fatigued decision-makers default to the safest option (like denying parole)?",
            "options": [
              "The exhausted brain seeks cognitive shortcuts to conserve mental effort.",
              "They are strictly ordered by law to reject all proposals.",
              "Fatigue enhances deep mathematical reflection.",
              "Decision fatigue only affects visual eyesight."
            ],
            "correctAnswer": "The exhausted brain seeks cognitive shortcuts to conserve mental effort.",
            "explanation": "Paragraph 2 & 3 explain the brain defaults to low-effort heuristics to avoid taxing executive analysis.",
            "difficulty": "C1",
            "tags": [
              "inference"
            ]
          },
          {
            "id": "v-r1-q6",
            "sectionId": "sec-vstep02-r1",
            "type": "reading-comprehension",
            "prompt": "What practical strategy is cited in paragraph 4 to mitigate personal decision fatigue?",
            "options": [
              "Eliminating low-value choices and prioritizing strategic deliberation in the morning.",
              "Consuming energy drinks every thirty minutes continuously.",
              "Working eighty hours without sleeping during weekends.",
              "Letting artificial intelligence vote in national political elections."
            ],
            "correctAnswer": "Eliminating low-value choices and prioritizing strategic deliberation in the morning.",
            "explanation": "Paragraph 4 highlights eliminating low-value decisions (e.g. minimal wardrobes) and scheduling morning strategic thought.",
            "difficulty": "B2",
            "tags": [
              "detail"
            ]
          },
          {
            "id": "v-r1-q7",
            "sectionId": "sec-vstep02-r1",
            "type": "reading-comprehension",
            "prompt": "The author's tone throughout the passage can best be described as:",
            "options": [
              "analytical and informative",
              "satirical and cynical",
              "nostalgic and poetic",
              "hostile and aggressive"
            ],
            "correctAnswer": "analytical and informative",
            "explanation": "The text presents neuroscientific and behavioral research with balanced, empirical, and educational prose.",
            "difficulty": "C1",
            "tags": [
              "author-tone"
            ]
          },
          {
            "id": "v-r1-q8",
            "sectionId": "sec-vstep02-r1",
            "type": "reading-comprehension",
            "prompt": "Which of the following would the author most likely recommend for an corporate executive?",
            "options": [
              "Schedule high-stakes contract negotiations at 9:00 AM rather than 4:30 PM.",
              "Spend three hours every morning selecting what tie to wear.",
              "Hold consecutive eight-hour board meetings without lunch breaks.",
              "Make all strategic mergers while driving in rush-hour traffic."
            ],
            "correctAnswer": "Schedule high-stakes contract negotiations at 9:00 AM rather than 4:30 PM.",
            "explanation": "Reserving fresh morning cognitive reserves for high-value decisions directly aligns with the author's conclusions.",
            "difficulty": "C1",
            "tags": [
              "application"
            ]
          },
          {
            "id": "v-r1-q9",
            "sectionId": "sec-vstep02-r1",
            "type": "reading-comprehension",
            "prompt": "In paragraph 3, the phrase 'defaulted to' means:",
            "options": [
              "automatically reverted to",
              "vigorously protested against",
              "refused to consider",
              "accidentally paid for"
            ],
            "correctAnswer": "automatically reverted to",
            "explanation": "'Defaulted to' indicates falling back upon an automatic, preset, or low-effort option.",
            "difficulty": "B2",
            "tags": [
              "vocabulary-context"
            ]
          },
          {
            "id": "v-r1-q10",
            "sectionId": "sec-vstep02-r1",
            "type": "reading-comprehension",
            "prompt": "What is the broader workplace consequence of recognizing cognitive ceilings?",
            "options": [
              "Instituting compulsory interval breaks and asynchronous decision workflows.",
              "Permanently closing down all corporate office buildings.",
              "Banning all employees from eating meals at work.",
              "Eliminating weekend holidays across all industries."
            ],
            "correctAnswer": "Instituting compulsory interval breaks and asynchronous decision workflows.",
            "explanation": "The final sentence mentions the adoption of compulsory interval breaks and asynchronous workflows.",
            "difficulty": "B2",
            "tags": [
              "detail"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "exam-ielts-acad-02",
    "title": "IELTS Academic Practice Test 02",
    "subtitle": "Reading Passage 1 & 2 + Academic Listening Section 3",
    "type": "ielts",
    "difficulty": "C1",
    "durationMinutes": 60,
    "totalQuestions": 15,
    "maxScore": 9,
    "tags": [
      "ielts",
      "academic",
      "reading",
      "listening",
      "band-8"
    ],
    "isOfficialMock": true,
    "coverImage": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&auto=format&fit=crop&q=80",
    "sections": [
      {
        "id": "sec-ielts02-r1",
        "title": "Reading Passage 1: The Evolution of Marine Cartography",
        "type": "reading",
        "durationMinutes": 20,
        "passage": "READING PASSAGE 1\n\nFor millennia, seafaring navigation was a hazardous art governed by astronomical guesswork and oral lore. Early Mediterranean mariners relied on periplus texts—descriptive shore itineraries listing landmarks, anchorages, and freshwater springs—without graphical geometric coordinates. The introduction of the magnetic mariner's compass to Europe in the late twelfth century revolutionized nautical exploration, birthing the portolan chart.\n\nPortolan charts represented a radical cartographic departure. Drawn on calfskin vellum, they were crisscrossed by rhumb lines: intersecting navigational rays radiating from thirty-two-point compass roses across sea basins. Rather than portraying land interiors, portolan charts prioritized coastal accuracy, charting ports, prevailing headlands, and navigational shoals with astonishing precision. A navigator utilizing a portolan chart could lay a magnetic bearing between two ports, adjust their sails to that bearing, and cross open water with unprecedented certitude.\n\nYet portolan charts harbored a fatal mathematical limitation: they assumed the Earth was flat. As European caravels ventured beyond the Mediterranean toward equatorial Africa and the New World, the convergence of longitudinal meridians distorted spherical distances onto planar sheets. A course steered on a constant compass bearing—a rhumb line or loxodrome—did not represent the shortest spherical distance (a great circle), causing navigators to drift hundreds of leagues off course.\n\nThis mathematical crisis was finally resolved in 1569 by Flemish geographer Gerardus Mercator. By designing a conformal cylindrical map projection where lines of longitude remained parallel vertical tracks and latitude lines spaced progressively wider toward the poles, Mercator preserved true angles. On a Mercator projection, any straight line represents a true line of constant magnetic bearing. Despite its notorious distortion of polar landmasses—making Greenland appear equivalent in size to the African continent—the Mercator projection became the universal standard for oceanic navigation, retaining its primacy into modern maritime GPS systems.",
        "questions": [
          {
            "id": "i2-r1-q1",
            "sectionId": "sec-ielts02-r1",
            "type": "reading-comprehension",
            "prompt": "What key technological instrument spurred the development of portolan charts in Europe?",
            "options": [
              "The magnetic mariner's compass",
              "The steam turbine engine",
              "The digital satellite receiver",
              "The optical marine microscope"
            ],
            "correctAnswer": "The magnetic mariner's compass",
            "explanation": "Paragraph 1 mentions the introduction of the magnetic mariner's compass in the late twelfth century birthed the portolan chart.",
            "difficulty": "B2",
            "tags": [
              "detail"
            ]
          },
          {
            "id": "i2-r1-q2",
            "sectionId": "sec-ielts02-r1",
            "type": "reading-comprehension",
            "prompt": "Unlike modern maps, what did medieval portolan charts deliberately omit?",
            "options": [
              "Inland continental geography and interior landmarks",
              "Coastal harbors and water depth markers",
              "Names of major seaport cities",
              "Compass rose bearing lines"
            ],
            "correctAnswer": "Inland continental geography and interior landmarks",
            "explanation": "Paragraph 2 notes that 'rather than portraying land interiors, portolan charts prioritized coastal accuracy'.",
            "difficulty": "B2",
            "tags": [
              "detail"
            ]
          },
          {
            "id": "i2-r1-q3",
            "sectionId": "sec-ielts02-r1",
            "type": "reading-comprehension",
            "prompt": "What critical mathematical flaw undermined portolan charts on transoceanic voyages?",
            "options": [
              "They assumed the Earth was a flat plane rather than an oblate spheroid.",
              "They were painted using toxic lead watercolors.",
              "They could only be read during full moon nights.",
              "Compass roses only had four cardinal points."
            ],
            "correctAnswer": "They assumed the Earth was a flat plane rather than an oblate spheroid.",
            "explanation": "Paragraph 3 explains the fatal limitation was assuming the Earth was flat, distorting spherical geometry across vast oceans.",
            "difficulty": "C1",
            "tags": [
              "detail"
            ]
          },
          {
            "id": "i2-r1-q4",
            "sectionId": "sec-ielts02-r1",
            "type": "reading-comprehension",
            "prompt": "What unique mathematical virtue made Mercator's 1569 projection revolutionary for sailors?",
            "options": [
              "Any straight line drawn on the map represents a true constant compass heading.",
              "It eliminated all navigational storms at sea.",
              "It accurately displayed the surface area of polar islands.",
              "It reduced fuel consumption on sailing ships by half."
            ],
            "correctAnswer": "Any straight line drawn on the map represents a true constant compass heading.",
            "explanation": "Paragraph 4 explains that on a Mercator projection, any straight line represents a true line of constant magnetic bearing.",
            "difficulty": "C1",
            "tags": [
              "detail"
            ]
          },
          {
            "id": "i2-r1-q5",
            "sectionId": "sec-ielts02-r1",
            "type": "reading-comprehension",
            "prompt": "What visual distortion does the Mercator projection notoriously introduce?",
            "options": [
              "Exaggerates the land area of high-latitude regions like Greenland.",
              "Makes equatorial continents appear ten times larger than reality.",
              "Erases entire ocean basins from the map.",
              "Inverts North and South orientations."
            ],
            "correctAnswer": "Exaggerates the land area of high-latitude regions like Greenland.",
            "explanation": "Paragraph 4 cites the distortion of polar landmasses, making Greenland appear the same size as Africa.",
            "difficulty": "B2",
            "tags": [
              "detail"
            ]
          }
        ]
      },
      {
        "id": "sec-ielts02-r2",
        "title": "Reading Passage 2: Abyssal Hydrothermal Ecology",
        "type": "reading",
        "durationMinutes": 20,
        "passage": "READING PASSAGE 2\n\nUntil the pioneering descent of the submersible 'Alvin' onto the Galápagos Rift in 1977, marine biology operated on an undisputed dogma: all terrestrial and oceanic life depended strictly upon solar energy harvested through photosynthesis. The discovery of vibrant biological communities thriving 2,500 meters beneath the surface in absolute pitch-blackness shattered this paradigm.\n\nClustered around hydrothermal vents colloquially termed 'black smokers', these abyssal ecosystems flourish along tectonic spreading ridges where magma superheats seawater to temperatures exceeding 350 degrees Celsius. Rather than boiling due to tremendous hydrostatic pressure, this mineral-laden fluid dissolves massive quantities of hydrogen sulfide, copper, iron, and zinc from the basaltic crust.\n\nAt the cornerstone of this food chain are chemotrophic archaebacteria. In an environment devoid of photons, these extremophiles synthesize organic carbohydrates by oxidizing reduced sulfur compounds. Thriving inside specialized vascular tissues of giant tube worms (Riftia pachyptila) in an obligate symbiotic relationship, these sulfur-oxidizing endosymbionts provide complete metabolic sustenance to their hosts, who possess neither mouth, gut, nor digestive tract.\n\nThe profound philosophical and astrobiological significance of deep-sea vents extends far beyond ecological novelty. Thermodynamic conditions around porous mineral chimneys mirror the prebiotic geochemical milieu of the Hadean Earth 4 billion years ago. Scientists increasingly hypothesize that the origin of terrestrial life transpired within these iron-sulfur catalytic chambers rather than in sunlit tidal pools, providing a compelling model for potential extraterrestrial life within the ice-covered oceans of Europa and Enceladus.",
        "questions": [
          {
            "id": "i2-r2-q1",
            "sectionId": "sec-ielts02-r2",
            "type": "reading-comprehension",
            "prompt": "What foundational scientific dogma was overturned by the 1977 Alvin expedition?",
            "options": [
              "That all biological life on Earth is strictly dependent upon photosynthetic solar energy.",
              "That water freezes into ice at low temperatures.",
              "That tectonic plates move across the Earth's mantle.",
              "That whales communicate via acoustic echolocation."
            ],
            "correctAnswer": "That all biological life on Earth is strictly dependent upon photosynthetic solar energy.",
            "explanation": "Paragraph 1 explains the expedition shattered the dogma that all life depended strictly upon solar photosynthesis.",
            "difficulty": "B2",
            "tags": [
              "detail"
            ]
          },
          {
            "id": "i2-r2-q2",
            "sectionId": "sec-ielts02-r2",
            "type": "reading-comprehension",
            "prompt": "What chemical process fuels the primary production in hydrothermal vent ecosystems?",
            "options": [
              "Chemotrophic oxidation of reduced hydrogen sulfide by archaebacteria",
              "Nuclear fission inside deep ocean basalt rocks",
              "Chlorophyll photosynthesis driven by moonlight",
              "Decomposition of plastic pollutants falling from ships"
            ],
            "correctAnswer": "Chemotrophic oxidation of reduced hydrogen sulfide by archaebacteria",
            "explanation": "Paragraph 3 explicitly identifies chemotrophic archaebacteria oxidizing reduced sulfur compounds.",
            "difficulty": "C1",
            "tags": [
              "detail"
            ]
          },
          {
            "id": "i2-r2-q3",
            "sectionId": "sec-ielts02-r2",
            "type": "reading-comprehension",
            "prompt": "What anatomical peculiarity characterizes giant tube worms (Riftia pachyptila)?",
            "options": [
              "They have no mouth, gut, or digestive tract of their own.",
              "They possess four pairs of compound eyes.",
              "They swim rapidly through open water using fins.",
              "They migrate to coastal beaches every spring to lay eggs."
            ],
            "correctAnswer": "They have no mouth, gut, or digestive tract of their own.",
            "explanation": "Paragraph 3 notes giant tube worms possess neither mouth, gut, nor digestive tract, relying on symbiotic bacteria.",
            "difficulty": "B2",
            "tags": [
              "detail"
            ]
          },
          {
            "id": "i2-r2-q4",
            "sectionId": "sec-ielts02-r2",
            "type": "reading-comprehension",
            "prompt": "Why do scientists hypothesize that terrestrial life originated around deep-sea vents?",
            "options": [
              "Thermodynamic conditions in mineral chimneys mirror Hadean prebiotic chemistry.",
              "Ancient dinosaur fossils were discovered inside hydrothermal vents.",
              "Solar radiation was too weak to allow life anywhere on land.",
              "Volcanic magma contains pre-formed human DNA molecules."
            ],
            "correctAnswer": "Thermodynamic conditions in mineral chimneys mirror Hadean prebiotic chemistry.",
            "explanation": "Paragraph 4 explains conditions around porous chimneys mirror the prebiotic geochemical milieu of the Hadean Earth.",
            "difficulty": "C1",
            "tags": [
              "inference"
            ]
          },
          {
            "id": "i2-r2-q5",
            "sectionId": "sec-ielts02-r2",
            "type": "reading-comprehension",
            "prompt": "In paragraph 2, the word 'superheats' indicates that the water:",
            "options": [
              "Reaches temperatures over 350°C without boiling due to immense pressure",
              "Turns instantly into dry steam that escapes into space",
              "Freezes into solid hydrothermal crystals",
              "Loses all mineral contents completely"
            ],
            "correctAnswer": "Reaches temperatures over 350°C without boiling due to immense pressure",
            "explanation": "Paragraph 2 explains water exceeds 350°C without boiling because of immense hydrostatic pressure.",
            "difficulty": "B2",
            "tags": [
              "vocabulary-context"
            ]
          }
        ]
      },
      {
        "id": "sec-ielts02-l3",
        "title": "Listening Section 3: Academic Tutorial on Urban Heat Islands",
        "type": "listening",
        "durationMinutes": 20,
        "audioUrl": "https://cdn.linguaflow.com/audio/ielts_test02_listening_sec3.mp3",
        "questions": [
          {
            "id": "i2-l3-q1",
            "sectionId": "sec-ielts02-l3",
            "type": "listening-comprehension",
            "prompt": "Listen to the university seminar discussion and choose the primary focus of Sarah's dissertation.",
            "audioText": "Professor Miller: Welcome, Sarah. Let's review your research proposal on microclimatic variations in high-density metropolitan zones. Sarah: Thank you, Professor. My dissertation examines how asphalt albedo modification and tree canopy distribution mitigate the urban heat island effect across commercial districts.",
            "options": [
              "Mitigating urban heat islands through reflective asphalt and tree canopy distribution",
              "Designing public transit bus routes in suburban villages",
              "Calculating the cost of air conditioning units in hospitals",
              "Measuring rainfall acid levels in rural farming valleys"
            ],
            "correctAnswer": "Mitigating urban heat islands through reflective asphalt and tree canopy distribution",
            "explanation": "Sarah confirms her dissertation examines asphalt albedo and tree canopy distribution against urban heat islands.",
            "difficulty": "B2",
            "tags": [
              "listening",
              "academic",
              "tutorial"
            ]
          },
          {
            "id": "i2-l3-q2",
            "sectionId": "sec-ielts02-l3",
            "type": "listening-comprehension",
            "prompt": "What limitation in Sarah's methodology does Professor Miller point out?",
            "audioText": "Professor Miller: Your satellite thermal imaging data is impressive, but you've relied strictly on summer daytime measurements. Urban heat islands frequently exhibit their most dangerous thermal disparities during nighttime radiation release.",
            "options": [
              "She only gathered summer daytime data while ignoring nighttime thermal release.",
              "She forgot to calibrate her thermometer instruments.",
              "Her software could not process color satellite photographs.",
              "She did not obtain permission from the municipal council."
            ],
            "correctAnswer": "She only gathered summer daytime data while ignoring nighttime thermal release.",
            "explanation": "The professor notes she relied strictly on daytime measurements, omitting critical nighttime disparities.",
            "difficulty": "C1",
            "tags": [
              "listening",
              "academic",
              "methodology"
            ]
          },
          {
            "id": "i2-l3-q3",
            "sectionId": "sec-ielts02-l3",
            "type": "listening-comprehension",
            "prompt": "What concrete step does Sarah agree to take before her next advisory meeting?",
            "audioText": "Sarah: That makes complete sense. I will deploy four wireless ground sensors in the central business district to log nocturnal temperature decay over a four-week span.",
            "options": [
              "Deploy ground sensors to track nocturnal temperature decay over four weeks.",
              "Switch her research topic to marine biology entirely.",
              "Interview one hundred city taxi drivers about street congestion.",
              "Submit her completed final thesis by tomorrow morning."
            ],
            "correctAnswer": "Deploy ground sensors to track nocturnal temperature decay over four weeks.",
            "explanation": "Sarah explicitly states she will deploy four ground sensors to log nocturnal temperature decay.",
            "difficulty": "B2",
            "tags": [
              "listening",
              "academic",
              "action-item"
            ]
          },
          {
            "id": "i2-l3-q4",
            "sectionId": "sec-ielts02-l3",
            "type": "listening-comprehension",
            "prompt": "According to the dialogue, what material reflects the most solar radiation away from pavements?",
            "audioText": "Professor Miller: Exactly. High-albedo permeable concrete coatings can reflect up to forty percent of solar irradiance compared to standard black bituminous asphalt.",
            "options": [
              "High-albedo permeable concrete coatings",
              "Dark bituminous tar asphalt",
              "Unfinished steel plates",
              "Wet river gravel"
            ],
            "correctAnswer": "High-albedo permeable concrete coatings",
            "explanation": "Professor Miller highlights high-albedo permeable concrete reflecting up to 40% of solar irradiance.",
            "difficulty": "B2",
            "tags": [
              "listening",
              "academic",
              "materials"
            ]
          },
          {
            "id": "i2-l3-q5",
            "sectionId": "sec-ielts02-l3",
            "type": "listening-comprehension",
            "prompt": "When is the revised methodology chapter due for submission?",
            "audioText": "Professor Miller: Let us reconvene on the fifteenth of next month. Please have the revised sensor calibration methodology submitted forty-eight hours in advance.",
            "options": [
              "Forty-eight hours before the fifteenth of next month",
              "By this Friday at midnight",
              "At the end of the academic semester",
              "Within twelve hours of this meeting"
            ],
            "correctAnswer": "Forty-eight hours before the fifteenth of next month",
            "explanation": "Professor Miller specifies submitting the revised methodology 48 hours prior to their meeting on the 15th.",
            "difficulty": "B2",
            "tags": [
              "listening",
              "academic",
              "deadline"
            ]
          }
        ]
      }
    ]
  }
];
