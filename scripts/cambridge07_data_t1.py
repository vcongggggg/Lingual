r"""
Module: cambridge07_data_t1.py
Defines mapped data for Cambridge IELTS 07 - Test 1 (Academic Pilot)
Includes:
- 4 Listening Sections (40 questions)
- 3 Reading Passages (40 questions)
- 2 Writing Topics & 2 Writing Models
- 3 Speaking Topics
All records have track='academic'.
"""

import json
import re

def clean_text_artifacts(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)
    text = re.sub(r"(?:www\.)?TopSage(?:\.com)?", "", text, flags=re.IGNORECASE)
    text = re.sub(r"大家网", "", text)
    text = re.sub(r"^##\s*(?:SECTION|TEST)\s*\d*.*$", "", text, flags=re.MULTILINE | re.IGNORECASE)
    text = re.sub(r"\bTRI\b", "", text)
    lines = [line.strip() for line in text.split("\n")]
    lines = [l for l in lines if l]
    return "\n\n".join(lines)

APOSTROPHE_FIXES = {
    r"\blo'ts\b": "lots",
    r"\badvertisemen'ts\b": "advertisements",
    r"\bstree'ts\b": "streets",
    r"\borgutnen'ts\b": "arguments",
    r"\bargumen'ts\b": "arguments",
    r"\bcoun'try\b": "country",
    r"\bcoun'tries\b": "countries",
    r"\baspec'ts\b": "aspects",
    r"\bagains't\b": "against",
    r"\bac'tually\b": "actually",
    r"\bsocie'ty\b": "society",
    r"\bbetter'to\b": "better to",
    r"\bno't\b": "not",
    r"\bthe'ir\b": "their"
}

def normalize_ocr_apostrophes(text: str) -> str:
    if not text:
        return ""
    res = text
    for pat, repl in APOSTROPHE_FIXES.items():
        res = re.sub(pat, repl, res, flags=re.IGNORECASE)
    return res

OFFICIAL_LISTENING_KEYS = {
    1: "(a) taxi/cab",
    2: "city centre/center",
    3: "wait",
    4: "door-to-door",
    5: "reserve (a seat)",
    6: "(the) 17th(of) October",
    7: "12.30",
    8: "Thomson",
    9: "AC 936",
    10: "3303 8450 2045 6837",
    11: "B",
    12: "A",
    13: "B",
    14: "C",
    15: "C",
    16: "A",
    17: "C",
    18: "A",
    19: "C",
    20: "B",
    21: "attitude(s)",
    22: "gender/sex",
    23: "creativity/creativeness",
    24: "A",
    25: "B",
    26: "A",
    27: "B",
    28: "culture",
    29: "profit(s)",
    30: "stress/strain",
    31: "April",
    32: "children",
    33: "repeated",
    34: "human",
    35: "magic",
    36: "distance",
    37: "culture",
    38: "fire(s)",
    39: "touching",
    40: "intact"
}

OFFICIAL_READING_KEYS = {
    1: "B",
    2: "A",
    3: "A",
    4: "E",
    5: "D",
    6: "phantom",
    7: "echoes/obstacles",
    8: "depth",
    9: "submarines",
    10: "natural selection",
    11: "radio waves/echoes",
    12: "mathematical theories",
    13: "zoologist",
    14: "xi",
    15: "vii",
    16: "v",
    17: "i",
    18: "ix",
    19: "ii",
    20: "x",
    21: "NO",
    22: "YES",
    23: "NOT GIVEN",
    24: "NO",
    25: "YES",
    26: "NOT GIVEN",
    27: "D",
    28: "A",
    29: "B",
    30: "C",
    31: "FALSE",
    32: "FALSE",
    33: "TRUE",
    34: "NOT GIVEN",
    35: "NOT GIVEN",
    36: "TRUE",
    37: "F",
    38: "H",
    39: "K",
    40: "G"
}

def build_test_1(raw_md_text: str, official_keys: dict):
    l_keys = official_keys["listening"]
    r_keys = official_keys["reading"]

    # --- 1. LISTENING AUDIOSCRIPTS & QUESTIONS ---
    s1_script_text = clean_text_artifacts("""
MAN: Hello, this is Land Transport Information at Toronto Airport. How may I help you?
WOMAN: Oh, good morning. Um, I'm flying to Toronto Airport next week, and I need to get to a town called um, Milton. Could you tell me how I can get there?
MAN: Milton, did you say? Let me see. I think that's about 150 miles south-west of here. In fact it's 147 miles to be exact, so it'll take you at least - say, three to four hours by road.
WOMAN: Wow! Is it as far as that?
MAN: Yes, I'm afraid so. But you have a number of options to get you there and you can always rent a car right here at the airport, of course.
WOMAN: Right. Well, I don't really want to drive myself, so I'd like more information about public transport.
MAN: OK. In that case the quickest and most comfortable is a cab and of course there are always plenty available. But it'll cost you. You can also take a Greyhound bus or there's an Airport Shuttle Service to Milton.
WOMAN: Hmmm, I think for that kind of distance a cab would be way beyond my budget. But the bus sounds OK. Can you tell me how much that would cost?
MAN: Sure. Let's see, that would be $15 one way, or $27.50 return... that's on the Greyhound.
WOMAN: Oh, that's quite cheap - great! But whereabouts does it stop in Milton?
MAN: It goes directly from the airport here to the City Centre and it's pretty fast. But you have to bear in mind that there is only one departure a day, so it depends what time your flight gets in.
WOMAN: Oh, of course. Hang on, we're due to get there at 11.30 am.
MAN: Hmmm, too bad, the bus leaves at 3.45, so you would have quite a wait - more than 4 hours.
WOMAN: Oh, I see. Well, what about the Shuttle you mentioned?
MAN: OK. That's the Airport Shuttle that will take you from the airport right to your hotel or private address. It's a door-to-door service and it would suit you much better, because there's one every two hours.
WOMAN: So how much does that cost?
MAN: Let's see. Yeah, that's $35 one way, $65 return, so I guess it's a bit more expensive than the Greyhound.
WOMAN: Oh, that doesn't sound too bad, especially if it'll take me straight to the hotel.
MAN: But you do need to reserve a seat.
WOMAN: OK, is it possible to make a booking right now? Through you?
MAN: Sure. OK, I just have to fill this form out for you. So what date do you want to book this for?
WOMAN: The 16th of October - oh, no, sorry, that's my departure date. I arrive on the 17th, so book it for then, please.
MAN: So, that's the Toronto Airport Shuttle to Milton. And this is for just one person or...?
WOMAN: Yes, just me, please.
MAN: Right. And you said your expected time of arrival was 11.30? So if I book your Shuttle for after 12.00 - let's say, 12.30: that should give you plenty of time to, you know, collect your baggage, maybe grab a coffee?
WOMAN: Yeah, that sounds fine, as long as we land on time!
MAN: Well, we'll take your flight details so you don't need to worry too much about that. Now, what about the fare? What sort of ticket do you want? One way or...?
WOMAN: Yes, that'll be fine, provided I can book the return trip once I'm there.
MAN: No problem - just allow a couple of days in advance to make sure you get a seat. And what's your name, please?
WOMAN: Janet, Janet Thomson.
MAN: Is that Thompson spelt with a 'p'?
WOMAN: No, it's T-H-O-M-S-O-N.
MAN: OK. And you'll be coming from the UK? What flight will you be travelling on?
WOMAN: Oh, it's Air Canada flight number AC936, from London Heathrow.
MAN: Right. Now, do you know where you'll be staying? We need to give the driver an address.
WOMAN: Yes, it's called the Vacation Motel - and I think it's near the town centre. Anyway, the address is 24, Kitchener Street - that's KITCHENER Street.
MAN: That's fine. Right, so that's $35 to pay please. Have you got your credit card number there?
WOMAN: Yes, it's a VISA card, and the number is 3303 8450 2045 6837.
MAN: OK. Well, that seems to be everything. Have a good trip and we'll see you in Toronto next week!
WOMAN: Yes, bye - oh, thanks for your help!
""")

    s2_script_text = clean_text_artifacts("""
Thank you all for coming to my talk this evening. It's nice to see so many people in the audience. For those of you who don't know very much about PS Camping, let me start by giving you some background information about the company.

The company started twenty-five years ago. It actually opened as a retail chain selling camping equipment, and then twenty years ago, it bought a small number of campsites in the UK, and began offering camping holidays. The company grew rapidly and has been providing holidays in continental Europe for the last fifteen years.

If you book a camping holiday with us, you'll have a choice of over three hundred sites. In Italy we now have some 64 sites that we either own, or have exclusive use of. France is where we have the majority of sites, and we currently have a project to expand into Switzerland. We also have a number of sites in Northern Spain, particularly in the mountainous region of Picos de Europa. We've upgraded all these Spanish sites, and improved them considerably from their original three-star rating.

We believe our holidays offer superb facilities for the whole family. Parents who want their children to be fully occupied for all or part of the day can take advantage of our children's activities. These are organised by our well-qualified and enthusiastic staff. Each day kicks off with a sports match, perhaps football, or volleyball, followed by an hour of drama for everyone. This may include singing or dancing, mime or other activities. In the afternoon, there's a different art activity for each day of the week including a poster competition or model making. What's more, our sites are truly child-friendly, and, with this in mind, we operate a no-noise rule in the evenings. Children's evening activities usually finish at 9.30, or occasionally 10, and from 10.30 holiday-makers are expected to be quiet in the areas where there are tents.

We want nothing to go wrong on a PS Camping holiday, but if it does, we also want all customers to be insured. If you haven't organised an annual insurance policy of your own you'll need to take out the low-cost cover we offer and we require that you arrange this when you make your holiday reservation.

There are many advantages to choosing PS Camping, and to recommending it to others. As a regular customer, you'll be kept informed of special offers, and your friends can benefit from ten per cent off their holiday, or book a luxury tent for the price of a standard one. In return, we'll send you a thank-you present, which you can choose from a list of high-quality items.

When it comes to our tents, these are equipped to the highest standard. We really do think of every essential detail, from an oven and cooking rings fuelled by bottled gas, to mirrors in the bedroom areas. If you don't want to cook indoors, you can borrow a barbecue if you ask in advance for one to be made available, and there's even a picnic blanket to sit on outside your tent. Inside, a box of games and toys can be found, and children's tents can be hired if required. All tents have a fridge, and if you want to spend the day on the beach, for example, ask for a specially designed PS Camping cool box, which will keep your food and drinks chilled. There are excellent washing facilities at all our sites, with washing machines and clothes lines in the central areas, along with mops and buckets in case your tent needs cleaning during your stay. All sites have a café and/or a shop for those who'd rather 'eat in' than dine at a local restaurant.
""")

    s3_script_text = clean_text_artifacts("""
TUTOR: Well, you've both been looking at different styles of managing individuals in companies and the workplace. How's the research going, Philip?
PHILIP: Well, I've been looking at why individualism, I mean individual differences, are such an important area of management studies. When you think about any organization, be it a family business or a multinational company, they are all fundamentally a group of people working together. But it's what these individuals contribute to their places of work that makes you realize how important they are. Of course they bring different ideas, but it's also their attitudes and their experiences of learning. Diversity is important in these areas too.
TUTOR: So why do people behave so differently from one another at work?
PHILIP: There are lots of reasons but research has shown a lot of it comes down to personality. And the other factor is gender. It's a well known fact that men and women do lots of things in different ways, and the workplace is no different.
TUTOR: Did you look at the effects of this variation on companies?
PHILIP: Yes, I did. On the positive side, exposure to such diversity helps encourage creativity which is generally an asset to a company. But unfortunately individual differences are also the root of conflict between staff and they can lead to difficulties for management, which can sometimes be serious.
TUTOR: Thanks, Philip. So now I guess the two main things to remember here are to identify individual talent and then to utilize it. So Janice, you were looking at identifying different talents in workers. Do you think this is easy for managers to do?
JANICE: Well, currently teamwork is in fashion in the workplace and in my opinion the importance of the individual is generally neglected. What managers should be targeting is those employees who can take the lead in a situation and are not afraid to accept the idea of responsibility.
TUTOR: That's true Janice but unfortunately many managers think the entire notion of encouraging individuality amongst their staff is far too hard.
JANICE: Yes, that may be true but I think one of the most important tasks of managers is to consider the needs of the individual on one hand and group co-operation and conformity on the other. It requires creative thinking on the part of management to avoid tension.
TUTOR: So Janice, what kind of people do you think companies should be looking for?
JANICE: Well, it has to start from the very beginning when companies are looking for new employees. When the personnel department is choosing between applicants they need to look for someone who's broken the mould and can think for themselves. Instead, people making these decisions often use a range of psychological tests to see if a person is a problem solver, or will do as they're told. I'm not convinced these qualities are actually the most important.
TUTOR: So do you think being a good team player is overrated?
JANICE: No, it's not overrated. You do need to learn the rules and learn them fast. No individual can get around this if you're working in an organization.
TUTOR: So how should managers deal with this?
JANICE: Rewards. When an individual demonstrates the behaviour the organisation expects, some kind of incentive can be given. What's important here is that this happens right at the beginning so new recruits learn the rules of the system immediately. Also the incentive should be something the individual actually wants, and this isn't always just money.
TUTOR: To come back to you, Philip. You were saying that recognition of good performers is essential. What else should managers be looking for?
PHILIP: Well, managing people means you not only have an understanding of your employees, but you also recognise the culture of the organization. In fact, for some organizations creativity and individuality may be the last thing they want to see during working hours!
TUTOR: Very true.
PHILIP: Yes, but managing people isn't as easy as it looks. For example, change in the workplace can be quite tricky, especially if there's a need to increase profit. And at times like these managers may have to give priority to profit rather than individual staff needs.
TUTOR: Yes, and that creates difficult situations for people.
PHILIP: Yes but what's important is that managers are able to deal with quite high levels of personal stress. During times of change they should be thinking not only about the strain on their staff but take time out to think of themselves.
TUTOR: Absolutely. So what are the implications of that for...
""")

    s4_script_text = clean_text_artifacts("""
Good afternoon, everyone!

This is the first seminar in preparation for our archaeological fieldwork in Namibia; we are fantastically lucky to have received partial research funding for this trip from our Institute, so I shall expect 200% attention and participation from you all. First in this seminar, I'm going to give a brief introduction to contemporary research on rock art, and in the second part I'm going to give you some do's and don'ts for our fieldwork trip in April - so please listen very carefully.

I'm first going to focus on the interpretation of rock art in Namibia. We are very fortunate to be going to an area where you can find some of the most important sites in the entire world. And I hope to show you how easy it is for everyone to make mistakes in looking at cultures which are different from our own - the first and most important lesson we have to learn.

In Namibia there are both paintings and engravings - that's where the surface of the rock is cut out. Many of the engravings show footprints of animals and most scholars used to think that the purpose of these was simple and obvious: this rock art was like a school book with pictures to teach children about tracks: which track belonged to which animal - giraffe, lion and so on.

But there were some mysteries. First, when you look at a typical Namibian painting or engraving, you see the tracks are repeated, there are dozens of tracks for the same animal. You'd expect just one clear illustration if the reason - the aim - was to teach tracking.

Now there were two more problems. Why are some of the engravings of animals very accurate as you'd expect - all clearly identifiable - and others quite unrealistic?

And another mystery - some of these unrealistic animals - that's in the engravings - seem to be half human. Some, for example, have got human faces. Many researchers now think that these were pictures the wise men engraved of themselves. They believed they could use magic to control the animals they had drawn, so the hunters could then catch them for food.

This shows you some of the dangers of coming from one culture to another, as we'll be doing, without understanding it fully. Scholars imagined that children looked at rock art pictures to learn to track - just because they themselves had learnt skills from pictures; many researchers now believe that rock art had a much more complex purpose. And we'll talk more about it next week!

Now before I invite you to join in a discussion in this second part of the seminar, I'd like to make some very important points about our fieldwork - and in fact any field trip to look at rock art.

We're going to a number of sites, and we won't always be together. The single largest problem faced by people who manage the sites is - yes, I'm sure you've guessed - damage caused by visitors, even though it's usually unintentional.

Whenever you do go to a site, don't forget you can learn many things from observing at a distance instead of walking all over it. This can really help to reduce visitor pressure. People often say, 'Well, there's only two of us and just this one time', but maybe thousands of people are saying the same thing.

And then some basic rules to guide you - we'll have our own camp near a village, but remember never to camp on a site if you go on your own. It may be disrespectful to the people of that culture, and certainly don't make fires, however romantic it may seem. It's really dangerous in dry areas, and you can easily burn priceless undiscovered material by doing so.

So, how are we going to enjoy the rock art on our field trip? By looking at it, drawing it and photographing it - NEVER by touching it or even tracing it. Rock art is fragile and precious.

Remember that climbing on rocks and in caves can destroy in a moment what has lasted for centuries. So no heroics in Namibia, please! Try to be extra careful and help others to be too.

And lastly please don't even move rocks or branches to take photographs - you should leave the site intact - I'm sure I can rely on you to do that.

Well, that's about all I want to say before today's first discussion, but if you have any questions please ask them now - and don't forget you'll find some fascinating information about world-wide sites on the Internet. Right, first question then?
""")

    q_s1 = [
        {"questionNumber": 1, "type": "notes_completion", "question": "Transport from airport to Milton: Options - 1 ......................................... : expensive", "options": [], "correctAnswer": l_keys[1], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 1, Question 1, Answer Key page 152"},
        {"questionNumber": 2, "type": "notes_completion", "question": "Transport from airport to Milton: Greyhound bus - $15 single, $27.50 return; direct to the 2 ......................................... ; long wait", "options": [], "correctAnswer": l_keys[2], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 1, Question 2, Answer Key page 152"},
        {"questionNumber": 3, "type": "notes_completion", "question": "Transport from airport to Milton: Greyhound bus - $15 single, $27.50 return; direct to the city centre; long 3 .........................................", "options": [], "correctAnswer": l_keys[3], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 1, Question 3, Answer Key page 152"},
        {"questionNumber": 4, "type": "notes_completion", "question": "Transport from airport to Milton: Airport Shuttle - 4 ......................................... service; need to reserve (a seat)", "options": [], "correctAnswer": l_keys[4], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 1, Question 4, Answer Key page 152"},
        {"questionNumber": 5, "type": "notes_completion", "question": "Transport from airport to Milton: Airport Shuttle - door-to-door service; need to 5 .........................................", "options": [], "correctAnswer": l_keys[5], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 1, Question 5, Answer Key page 152"},
        {"questionNumber": 6, "type": "form_completion", "question": "Airport Shuttle Booking Form: Date of arrival: 6 .........................................", "options": [], "correctAnswer": l_keys[6], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 1, Question 6, Answer Key page 152"},
        {"questionNumber": 7, "type": "form_completion", "question": "Airport Shuttle Booking Form: Booking time: 7 ......................................... pm", "options": [], "correctAnswer": l_keys[7], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 1, Question 7, Answer Key page 152"},
        {"questionNumber": 8, "type": "form_completion", "question": "Airport Shuttle Booking Form: Passenger name: Janet 8 .........................................", "options": [], "correctAnswer": l_keys[8], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 1, Question 8, Answer Key page 152"},
        {"questionNumber": 9, "type": "form_completion", "question": "Airport Shuttle Booking Form: Flight details - Flight No: 9 ......................................... from London Heathrow", "options": [], "correctAnswer": l_keys[9], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 1, Question 9, Answer Key page 152"},
        {"questionNumber": 10, "type": "form_completion", "question": "Airport Shuttle Booking Form: Credit Card No: (Visa) 10 .........................................", "options": [], "correctAnswer": l_keys[10], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 1, Question 10, Answer Key page 152"}
    ]

    s2_match_opts = [
        "A They are provided in all tents.",
        "B They are found in central areas of the campsite.",
        "C They are available on request."
    ]
    q_s2 = [
        {"questionNumber": 11, "type": "multiple_choice", "question": "PS Camping has been organising holidays for (Question 11)", "options": ["A 15 years.", "B 20 years.", "C 25 years."], "correctAnswer": l_keys[11], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 2, Question 11, Answer Key page 152"},
        {"questionNumber": 12, "type": "multiple_choice", "question": "The company has most camping sites in (Question 12)", "options": ["A France.", "B Italy.", "C Switzerland."], "correctAnswer": l_keys[12], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 2, Question 12, Answer Key page 152"},
        {"questionNumber": 13, "type": "multiple_choice", "question": "Which organised activity can children do every day of the week? (Question 13)", "options": ["A football", "B drama", "C model making"], "correctAnswer": l_keys[13], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 2, Question 13, Answer Key page 152"},
        {"questionNumber": 14, "type": "multiple_choice", "question": "Some areas of the sites have a 'no noise' rule after (Question 14)", "options": ["A 9.30 p.m.", "B 10.00 p.m.", "C 10.30 p.m."], "correctAnswer": l_keys[14], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 2, Question 14, Answer Key page 152"},
        {"questionNumber": 15, "type": "multiple_choice", "question": "The holiday insurance that is offered by PS Camping (Question 15)", "options": ["A can be charged on an annual basis.", "B is included in the price of the holiday.", "C must be taken out at the time of booking."], "correctAnswer": l_keys[15], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 2, Question 15, Answer Key page 152"},
        {"questionNumber": 16, "type": "multiple_choice", "question": "Customers who recommend PS Camping to friends will receive (Question 16)", "options": ["A a free gift.", "B an upgrade to a luxury tent.", "C a discount."], "correctAnswer": l_keys[16], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 2, Question 16, Answer Key page 152"},
        {"questionNumber": 17, "type": "matching", "question": "What does the speaker say about the following item: 17 barbecues", "options": s2_match_opts, "correctAnswer": l_keys[17], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 2, Question 17, Answer Key page 152"},
        {"questionNumber": 18, "type": "matching", "question": "What does the speaker say about the following item: 18 toys", "options": s2_match_opts, "correctAnswer": l_keys[18], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 2, Question 18, Answer Key page 152"},
        {"questionNumber": 19, "type": "matching", "question": "What does the speaker say about the following item: 19 cool boxes", "options": s2_match_opts, "correctAnswer": l_keys[19], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 2, Question 19, Answer Key page 152"},
        {"questionNumber": 20, "type": "matching", "question": "What does the speaker say about the following item: 20 mops and buckets", "options": s2_match_opts, "correctAnswer": l_keys[20], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 2, Question 20, Answer Key page 152"}
    ]

    q_s3 = [
        {"questionNumber": 21, "type": "notes_completion", "question": "Differences between individuals in the workplace: Individuals bring different ideas, 21 ......................................... and learning experiences.", "options": [], "correctAnswer": l_keys[21], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 3, Question 21, Answer Key page 152"},
        {"questionNumber": 22, "type": "notes_completion", "question": "Work behaviour differences are due to personality and 22 ......................................... .", "options": [], "correctAnswer": l_keys[22], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 3, Question 22, Answer Key page 152"},
        {"questionNumber": 23, "type": "notes_completion", "question": "Effects of diversity on companies: Advantage - diversity develops 23 ......................................... .", "options": [], "correctAnswer": l_keys[23], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 3, Question 23, Answer Key page 152"},
        {"questionNumber": 24, "type": "multiple_choice", "question": "Janice thinks that employers should encourage workers who are (Question 24)", "options": ["A potential leaders.", "B open to new ideas.", "C good at teamwork."], "correctAnswer": l_keys[24], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 3, Question 24, Answer Key page 152"},
        {"questionNumber": 25, "type": "multiple_choice", "question": "Janice suggests that managers may find it difficult to (Question 25)", "options": ["A form successful groups.", "B balance conflicting needs.", "C deal with uncooperative workers."], "correctAnswer": l_keys[25], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 3, Question 25, Answer Key page 152"},
        {"questionNumber": 26, "type": "multiple_choice", "question": "Janice believes employers should look for job applicants who (Question 26)", "options": ["A can think independently.", "B will obey the system.", "C can solve problems."], "correctAnswer": l_keys[26], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 3, Question 26, Answer Key page 152"},
        {"questionNumber": 27, "type": "multiple_choice", "question": "Janice believes managers should (Question 27)", "options": ["A demonstrate good behaviour.", "B encourage co-operation early on.", "C increase financial incentives."], "correctAnswer": l_keys[27], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 3, Question 27, Answer Key page 152"},
        {"questionNumber": 28, "type": "sentence_completion", "question": "All managers need to understand their employees and recognise their company's 28 ......................................... .", "options": [], "correctAnswer": l_keys[28], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 3, Question 28, Answer Key page 152"},
        {"questionNumber": 29, "type": "sentence_completion", "question": "When managing change, increasing the company's 29 ......................................... may be more important than employee satisfaction.", "options": [], "correctAnswer": l_keys[29], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 3, Question 29, Answer Key page 152"},
        {"questionNumber": 30, "type": "sentence_completion", "question": "During periods of change, managers may have to cope with increased amounts of 30 ......................................... .", "options": [], "correctAnswer": l_keys[30], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 3, Question 30, Answer Key page 152"}
    ]

    q_s4 = [
        {"questionNumber": 31, "type": "notes_completion", "question": "Seminar on rock art: Preparation for fieldwork trip to Namibia in 31 ......................................... .", "options": [], "correctAnswer": l_keys[31], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 4, Question 31, Answer Key page 152"},
        {"questionNumber": 32, "type": "notes_completion", "question": "Earliest explanation of animal footprint engravings: They were used to help 32 ......................................... learn about tracking.", "options": [], "correctAnswer": l_keys[32], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 4, Question 32, Answer Key page 152"},
        {"questionNumber": 33, "type": "notes_completion", "question": "Unsolved problems: Why are the tracks usually 33 ......................................... ?", "options": [], "correctAnswer": l_keys[33], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 4, Question 33, Answer Key page 152"},
        {"questionNumber": 34, "type": "notes_completion", "question": "Unsolved problems: Why are the unrealistic animals sometimes half 34 ......................................... ?", "options": [], "correctAnswer": l_keys[34], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 4, Question 34, Answer Key page 152"},
        {"questionNumber": 35, "type": "notes_completion", "question": "More recent explanation: Wise men may have been trying to control wild animals with 35 ......................................... .", "options": [], "correctAnswer": l_keys[35], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 4, Question 35, Answer Key page 152"},
        {"questionNumber": 36, "type": "sentence_completion", "question": "If you look at a site from a 36 ......................................... , you reduce visitor pressure.", "options": [], "correctAnswer": l_keys[36], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 4, Question 36, Answer Key page 152"},
        {"questionNumber": 37, "type": "sentence_completion", "question": "To camp on a site may be disrespectful to people from that 37 ......................................... .", "options": [], "correctAnswer": l_keys[37], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 4, Question 37, Answer Key page 152"},
        {"questionNumber": 38, "type": "sentence_completion", "question": "Undiscovered material may be damaged by 38 ......................................... .", "options": [], "correctAnswer": l_keys[38], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 4, Question 38, Answer Key page 152"},
        {"questionNumber": 39, "type": "sentence_completion", "question": "You should avoid 39 ......................................... or tracing rock art as it is so fragile.", "options": [], "correctAnswer": l_keys[39], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 4, Question 39, Answer Key page 152"},
        {"questionNumber": 40, "type": "sentence_completion", "question": "In general, your aim is to leave the site 40 ......................................... .", "options": [], "correctAnswer": l_keys[40], "sourceRef": "Cambridge IELTS 7, Test 1, Listening Section 4, Question 40, Answer Key page 152"}
    ]

    listening_sections = [
        {"id": "cam07-academic-t1-l1", "section": 1, "track": "academic", "cefrLevel": "B1", "difficultyBand": "5.5", "title": "Test 1 Listening Section 1: Transport from Airport to Milton", "titleVi": "Bài nghe 1 Phần 1: Phương tiện di chuyển từ Sân bay đến Milton", "scriptJson": json.dumps([{"speaker": "Airport Staff & Caller", "textEn": s1_script_text}], ensure_ascii=False), "questionsJson": json.dumps(q_s1, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-1/listening/section-1"},
        {"id": "cam07-academic-t1-l2", "section": 2, "track": "academic", "cefrLevel": "B2", "difficultyBand": "6.0", "title": "Test 1 Listening Section 2: PS Camping Holidays Overview", "titleVi": "Bài nghe 1 Phần 2: Giới thiệu dịch vụ cắm trại PS Camping", "scriptJson": json.dumps([{"speaker": "Company Representative", "textEn": s2_script_text}], ensure_ascii=False), "questionsJson": json.dumps(q_s2, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-1/listening/section-2"},
        {"id": "cam07-academic-t1-l3", "section": 3, "track": "academic", "cefrLevel": "B2", "difficultyBand": "6.5", "title": "Test 1 Listening Section 3: Differences Between Individuals in the Workplace", "titleVi": "Bài nghe 1 Phần 3: Khác biệt cá nhân trong môi trường làm việc", "scriptJson": json.dumps([{"speaker": "Tutor, Janice & Philip", "textEn": s3_script_text}], ensure_ascii=False), "questionsJson": json.dumps(q_s3, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-1/listening/section-3"},
        {"id": "cam07-academic-t1-l4", "section": 4, "track": "academic", "cefrLevel": "C1", "difficultyBand": "7.5", "title": "Test 1 Listening Section 4: Seminar on Rock Art in Namibia", "titleVi": "Bài nghe 1 Phần 4: Hội thảo về nghệ thuật khắc đá tại Namibia", "scriptJson": json.dumps([{"speaker": "Archaeology Lecturer", "textEn": s4_script_text}], ensure_ascii=False), "questionsJson": json.dumps(q_s4, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-1/listening/section-4"}
    ]

    # --- 2. READING PASSAGES & QUESTIONS ---
    p1_paras = [
        "A Bats have a problem: how to find their way around in the dark. They hunt at night, and cannot use light to help them find prey and avoid obstacles. You might say that this is a problem of their own making, one that they could avoid simply by changing their habits and hunting by day. But the daytime economy is already heavily exploited by other creatures such as birds. Given that there is a living to be made at night, and given that alternative daytime trades are thoroughly occupied, natural selection has favoured bats that make a go of the night-hunting trade. It is probable that the nocturnal trades go way back in the ancestry of all mammals. In the time when the dinosaurs dominated the daytime economy, our mammalian ancestors probably only managed to survive at all because they found ways of scraping a living at night. Only after the mysterious mass extinction of the dinosaurs about 65 million years ago were our ancestors able to emerge into the daylight in any substantial numbers.",
        "B Bats have an engineering problem: how to find their way and find their prey in the absence of light. Bats are not the only creatures to face this difficulty today. Obviously the night-flying insects that they prey on must find their way about somehow. Deep-sea fish and whales have little or no light by day or by night. Fish and dolphins that live in extremely muddy water cannot see because, although there is light, it is obstructed and scattered by the dirt in the water. Plenty of other modern animals make their living in conditions where seeing is difficult or impossible.",
        "C Given the questions of how to manoeuvre in the dark, what solutions might an engineer consider? The first one that might occur to him is to manufacture light, to use a lantern or a searchlight. Fireflies and some fish (usually with the help of bacteria) have the power to manufacture their own light, but the process seems to consume a large amount of energy. Fireflies use their light for attracting mates. This doesn't require a prohibitive amount of energy: a male's tiny pinprick of light can be seen by a female from some distance on a dark night, since her eyes are exposed directly to the light source itself. However, using light to find one's own way around requires vastly more energy, since the eyes have to detect the tiny fraction of the light that bounces off each part of the scene. The light source must therefore be immensely brighter if it is to be used as a headlight to illuminate the path, than if it is to be used as a signal to others. In any event, whether or not the reason is the energy expense, it seems to be the case that, with the possible exception of some weird deep-sea fish, no animal apart from man uses manufactured light to find its way about.",
        "D What else might the engineer think of? Well, blind humans sometimes seem to have an uncanny sense of obstacles in their path. It has been given the name 'facial vision', because blind people have reported that it feels a bit like the sense of touch, on the face. One report tells of a totally blind boy who could ride his tricycle at good speed round the block near his home, using facial vision. Experiments showed that, in fact, facial vision is nothing to do with touch or the front of the face, although the sensation may be referred to the front of the face, like the referred pain in a phantom limb. The sensation of facial vision, it turns out, really goes in through the ears. Blind people, without even being aware of the fact, are actually using echoes of their own footsteps and of other sounds, to sense the presence of obstacles. Before this was discovered, engineers had already built instruments to exploit the principle, for example to measure the depth of the sea under a ship. After this technique had been invented, it was only a matter of time before weapons designers adapted it for the detection of submarines. Both sides in the Second World War relied heavily on these devices, under such codenames as Asdic (British) and Sonar (American), as well as Radar (American) or RDF (British), which uses radio echoes rather than sound echoes.",
        "E The Sonar and Radar pioneers didn't know it then, but all the world now knows that bats, or rather natural selection working on bats, had perfected the system tens of millions of years earlier, and their 'radar' achieves feats of detection and navigation that would strike an engineer dumb with admiration. It is technically incorrect to talk about bat 'radar', since they do not use radio waves. It is sonar. But the underlying mathematical theories of radar and sonar are very similar, and much of our scientific understanding of the details of what bats are doing has come from applying radar theory to them. The American zoologist Donald Griffin, who was largely responsible for the discovery of sonar in bats, coined the term 'echolocation' to cover both sonar and radar, whether used by animals or by human instruments."
    ]

    p1_opts = ["A", "B", "C", "D", "E"]
    q_p1 = [
        {"questionNumber": 1, "type": "matching_information", "question": "Which paragraph contains: examples of wildlife other than bats which do not rely on vision to navigate by? (Question 1)", "options": p1_opts, "correctAnswer": r_keys[1], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 1, Question 1, Answer Key page 153"},
        {"questionNumber": 2, "type": "matching_information", "question": "Which paragraph contains: how early mammals avoided dying out? (Question 2)", "options": p1_opts, "correctAnswer": r_keys[2], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 1, Question 2, Answer Key page 153"},
        {"questionNumber": 3, "type": "matching_information", "question": "Which paragraph contains: why bats hunt in the dark? (Question 3)", "options": p1_opts, "correctAnswer": r_keys[3], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 1, Question 3, Answer Key page 153"},
        {"questionNumber": 4, "type": "matching_information", "question": "Which paragraph contains: how a particular discovery has helped our understanding of bats? (Question 4)", "options": p1_opts, "correctAnswer": r_keys[4], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 1, Question 4, Answer Key page 153"},
        {"questionNumber": 5, "type": "matching_information", "question": "Which paragraph contains: early military uses of echolocation? (Question 5)", "options": p1_opts, "correctAnswer": r_keys[5], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 1, Question 5, Answer Key page 153"},
        {"questionNumber": 6, "type": "summary_completion", "question": "Facial Vision: In fact, the sensation is more similar to the way in which pain from a 6 ......................................... arm or leg might be felt.", "options": [], "correctAnswer": r_keys[6], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 1, Question 6, Answer Key page 153"},
        {"questionNumber": 7, "type": "summary_completion", "question": "Facial Vision: The ability actually comes from perceiving 7 ......................................... through the ears.", "options": [], "correctAnswer": r_keys[7], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 1, Question 7, Answer Key page 153"},
        {"questionNumber": 8, "type": "summary_completion", "question": "Facial Vision: However, even before this was understood, the principle had been applied in the design of instruments which calculated the 8 ......................................... of the seabed.", "options": [], "correctAnswer": r_keys[8], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 1, Question 8, Answer Key page 153"},
        {"questionNumber": 9, "type": "summary_completion", "question": "Facial Vision: This was followed by a wartime application in devices for finding 9 ......................................... .", "options": [], "correctAnswer": r_keys[9], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 1, Question 9, Answer Key page 153"},
        {"questionNumber": 10, "type": "sentence_completion", "question": "Long before the invention of radar, 10 ......................................... had resulted in a sophisticated radar-like system in bats.", "options": [], "correctAnswer": r_keys[10], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 1, Question 10, Answer Key page 153"},
        {"questionNumber": 11, "type": "sentence_completion", "question": "Radar is an inaccurate term when referring to bats because 11 ......................................... are not used in their navigation system.", "options": [], "correctAnswer": r_keys[11], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 1, Question 11, Answer Key page 153"},
        {"questionNumber": 12, "type": "sentence_completion", "question": "Radar and sonar are based on similar 12 ......................................... .", "options": [], "correctAnswer": r_keys[12], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 1, Question 12, Answer Key page 153"},
        {"questionNumber": 13, "type": "sentence_completion", "question": "The word 'echolocation' was first used by someone working as a 13 ......................................... .", "options": [], "correctAnswer": r_keys[13], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 1, Question 13, Answer Key page 153"}
    ]

    p2_paras = [
        "A The history of human civilisation is entwined with the history of the ways we have learned to manipulate water resources. As towns gradually expanded, water was brought from increasingly remote sources, leading to sophisticated engineering efforts such as dams and aqueducts. At the height of the Roman Empire, nine major systems, with an innovative layout of pipes and well-built sewers, supplied the occupants of Rome with as much water per person as is provided in many parts of the industrial world today.",
        "B During the industrial revolution and population explosion of the 19th and 20th centuries, the demand for water rose dramatically. Unprecedented construction of tens of thousands of monumental engineering projects designed to control floods, protect clean water supplies, and provide water for irrigation and hydropower brought great benefits to hundreds of millions of people. Food production has kept pace with soaring populations mainly because of the expansion of artificial irrigation systems that make possible the growth of 40 % of the world's food. Nearly one fifth of all the electricity generated worldwide is produced by turbines spun by the power of falling water.",
        "C Yet there is a dark side to this picture: despite our progress, half of the world's population still suffers, with water services inferior to those available to the ancient Greeks and Romans. As the United Nations report on access to water reiterated in November 2001, more than one billion people lack access to clean drinking water; some two and a half billion do not have adequate sanitation services. Preventable water-related diseases kill an estimated 10,000 to 20,000 children every day, and the latest evidence suggests that we are falling behind in efforts to solve these problems.",
        "D The consequences of our water policies extend beyond jeopardising human health. Tens of millions of people have been forced to move from their homes - often with little warning or compensation - to make way for the reservoirs behind dams. More than 20 % of all freshwater fish species are now threatened or endangered because dams and water withdrawals have destroyed the free-flowing river ecosystems where they thrive. Certain irrigation practices degrade soil quality and reduce agricultural productivity. Groundwater aquifers* are being pumped down faster than they are naturally replenished in parts of India, China, the USA and elsewhere. And disputes over shared water resources have led to violence and continue to raise local, national and even international tensions. [*groundwater aquifers: underground stores of water]",
        "E At the outset of the new millennium, however, the way resource planners think about water is beginning to change. The focus is slowly shifting back to the provision of basic human and environmental needs as top priority - ensuring 'some for all,' instead of 'more for some'. Some water experts are now demanding that existing infrastructure be used in smarter ways rather than building new facilities, which is increasingly considered the option of last, not first, resort. This shift in philosophy has not been universally accepted, and it comes with strong opposition from some established water organisations. Nevertheless, it may be the only way to address successfully the pressing problems of providing everyone with clean water to drink, adequate water to grow food and a life free from preventable water-related illness.",
        "F Fortunately - and unexpectedly - the demand for water is not rising as rapidly as some predicted. As a result, the pressure to build new water infrastructures has diminished over the past two decades. Although population, industrial output and economic productivity have continued to soar in developed nations, the rate at which people withdraw water from aquifers, rivers and lakes has slowed. And in a few parts of the world, demand has actually fallen.",
        "G What explains this remarkable turn of events? Two factors: people have figured out how to use water more efficiently, and communities are rethinking their priorities for water use. Throughout the first three-quarters of the 20th century, the quantity of freshwater consumed per person doubled on average; in the USA, water withdrawals increased tenfold while the population quadrupled. But since 1980, the amount of water consumed per person has actually decreased, thanks to a range of new technologies that help to conserve water in homes and industry. In 1965, for instance, Japan used approximately 13 million gallons* of water to produce $1 million of commercial output; by 1989 this had dropped to 3.5 million gallons (even accounting for inflation) - almost a quadrupling of water productivity. In the USA, water withdrawals have fallen by more than 20 % from their peak in 1980. [*1 gallon: 4.546 litres]",
        "H On the other hand, dams, aqueducts and other kinds of infrastructure will still have to be built, particularly in developing countries where basic human needs have not been met. But such projects must be built to higher specifications and with more accountability to local people and their environment than in the past. And even in regions where new projects seem warranted, we must find ways to meet demands with fewer resources, respecting ecological criteria and to a smaller budget."
    ]

    p2_headings = [
        "i Scientists' call for a revision of policy",
        "ii An explanation for reduced water use",
        "iii How a global challenge was met",
        "iv Irrigation systems fall into disuse",
        "v Environmental effects",
        "vi The financial cost of recent technological improvements",
        "vii The relevance to health",
        "viii Addressing the concern over increasing populations",
        "ix A surprising downward trend in demand for water",
        "x The need to raise standards",
        "xi A description of ancient water supplies"
    ]

    q_p2 = [
        {"questionNumber": 14, "type": "matching_headings", "question": "Choose the correct heading for Paragraph A from the list of headings below.", "options": p2_headings, "correctAnswer": r_keys[14], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 2, Question 14, Answer Key page 153"},
        {"questionNumber": 15, "type": "matching_headings", "question": "Choose the correct heading for Paragraph C from the list of headings below.", "options": p2_headings, "correctAnswer": r_keys[15], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 2, Question 15, Answer Key page 153"},
        {"questionNumber": 16, "type": "matching_headings", "question": "Choose the correct heading for Paragraph D from the list of headings below.", "options": p2_headings, "correctAnswer": r_keys[16], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 2, Question 16, Answer Key page 153"},
        {"questionNumber": 17, "type": "matching_headings", "question": "Choose the correct heading for Paragraph E from the list of headings below.", "options": p2_headings, "correctAnswer": r_keys[17], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 2, Question 17, Answer Key page 153"},
        {"questionNumber": 18, "type": "matching_headings", "question": "Choose the correct heading for Paragraph F from the list of headings below.", "options": p2_headings, "correctAnswer": r_keys[18], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 2, Question 18, Answer Key page 153"},
        {"questionNumber": 19, "type": "matching_headings", "question": "Choose the correct heading for Paragraph G from the list of headings below.", "options": p2_headings, "correctAnswer": r_keys[19], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 2, Question 19, Answer Key page 153"},
        {"questionNumber": 20, "type": "matching_headings", "question": "Choose the correct heading for Paragraph H from the list of headings below.", "options": p2_headings, "correctAnswer": r_keys[20], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 2, Question 20, Answer Key page 153"},
        {"questionNumber": 21, "type": "yes_no_not_given", "question": "Water use per person is higher in the industrial world than it was in Ancient Rome.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[21], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 2, Question 21, Answer Key page 153"},
        {"questionNumber": 22, "type": "yes_no_not_given", "question": "Feeding increasing populations is possible due primarily to improved irrigation systems.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[22], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 2, Question 22, Answer Key page 153"},
        {"questionNumber": 23, "type": "yes_no_not_given", "question": "Modern water systems imitate those of the ancient Greeks and Romans.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[23], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 2, Question 23, Answer Key page 153"},
        {"questionNumber": 24, "type": "yes_no_not_given", "question": "Industrial growth is increasing the overall demand for water.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[24], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 2, Question 24, Answer Key page 153"},
        {"questionNumber": 25, "type": "yes_no_not_given", "question": "Modern technologies have led to a reduction in domestic water consumption.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[25], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 2, Question 25, Answer Key page 153"},
        {"questionNumber": 26, "type": "yes_no_not_given", "question": "In the future, governments should maintain ownership of water infrastructures.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[26], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 2, Question 26, Answer Key page 153"}
    ]

    p3_paras = [
        "Educating Psyche by Bernie Neville is a book which looks at radical new approaches to learning, describing the effects of emotion, imagination and the unconscious on learning. One theory discussed in the book is that proposed by George Lozanov, which focuses on the power of suggestion.",
        "Lozanov's hobby is hypnotherapy and the theory was told that under hypnosis, people remember things they forgot they knew. Lozanov became interested in the possibility of using hypnosis in teaching. However, he soon realized that teaching with hypnosis was fraught with difficulties, not least the fact that hypnosis lacks credibility with the general public. He also found that hypnosis was unnecessary: the power of suggestion is effective without hypnosis. In suggestive teaching, or suggestopedia, Lozanov claims to be tapping into the reserve capacity of the brain.",
        "Suggestion is in action throughout our lives, but we often do not realize it. We think that we learn from a lecture or a book by paying conscious attention to what is being said or written. But we are also influenced by peripheral details - the colour of the lecture room, the voice of the lecturer, the font size of the book, the emotional state of the teacher. In other words, our subconscious mind absorbs far more information than our conscious attention does.",
        "This phenomenon can be partly attributed to the common counterproductive approach to study (making extreme efforts to memorise, tensing muscles, inducing fatigue), but it also simply reflects the way the brain functions. Lozanov therefore made indirect instruction (suggestion) central to his teaching system. In suggestopedia, as he called his method, consciousness is shifted away from the curriculum to focus on something peripheral. The curriculum then becomes peripheral and is dealt with by the reserve capacity of the brain.",
        "The suggestopedic approach to foreign language learning provides a good illustration. In its most recent variant (1980), it consists of the reading of vocabulary and text while the class is listening to music. The first session is in two parts. In the first part, the music is classical (Mozart, Beethoven, Brahms) and the teacher reads the text slowly and solemnly, with attention to the dynamics of the music. The students follow the text in their books. This is followed by several minutes of silence. In the second part, they listen to baroque music (Bach, Corelli, Handel) while the teacher reads the text in a normal speaking voice. During this time they have their books closed. During the whole of this session, their attention is passive; they listen to the music but make no attempt to learn the material.",
        "Beforehand, the students have been carefully prepared for the language learning experience. Through meeting with the staff and satisfied students they develop the expectation that learning will be easy and pleasant and that they will successfully learn several hundred words of the foreign language during the class. In a preliminary talk, the teacher introduces them to the material to be covered, but does not 'teach' it. Likewise, the students are instructed not to try to learn it during this introduction.",
        "Some hours after the two-part session, there is a follow-up class at which the students are stimulated to recall the material presented. Once again the approach is indirect. The students do not focus their attention on trying to remember the vocabulary, but focus on using the language to communicate (e.g. through games or improvised dramatisations). Such methods are not unusual in language teaching. What is distinctive in the suggestopedic method is that they are devoted entirely to assisting recall. The 'learning' of the material is assumed to be automatic and effortless, accomplished while listening to music. The teacher's task is to assist the students to apply what they have learned paraconsciously, and in doing so to make it easily accessible to consciousness. Another difference from conventional teaching is the evidence that students can regularly learn 1000 new words of a foreign language during a suggestopedic session, as well as grammar and idiom.",
        "Lozanov experimented with teaching by direct suggestion during sleep, hypnosis and trance states, but found such procedures unnecessary. Hypnosis, yoga, Silva mind-control, religious ceremonies and faith healing are all associated with successful suggestion, but none of their techniques seem to be essential to it. Such rituals may be seen as placebos. Lozanov acknowledges that the ritual surrounding suggestion in his own system is also a placebo, but maintains that without such a placebo people are unable or afraid to tap the reserve capacity of their brains. Like any placebo, it must be dispensed with authority to be effective. Just as a doctor calls on the full power of autocratic suggestion by insisting that the patient take precisely this white capsule precisely three times a day before meals, Lozanov is categoric in insisting that the suggestopedic session be conducted exactly in the manner designated, by trained and accredited suggestopedic teachers.",
        "While suggestopedia has gained some notoriety through success in the teaching of modern languages, few teachers are able to emulate the spectacular results of Lozanov and his associates. We can, perhaps, attribute mediocre results to an inadequate placebo effect. The students have not developed the appropriate mind set. They are often not motivated to learn through this method. They do not have enough 'faith'. They do not see it as 'real teaching', especially as it does not seem to involve the 'work' they have learned to believe is essential to learning."
    ]

    p3_summary_opts = [
        "A spectacular",
        "B teaching",
        "C lesson",
        "D authoritarian",
        "E unpopular",
        "F ritual",
        "G unspectacular",
        "H placebo",
        "I involved",
        "J appropriate",
        "K well known"
    ]

    q_p3 = [
        {"questionNumber": 27, "type": "multiple_choice", "question": "The book Educating Psyche is mainly concerned with (Question 27)", "options": ["A the power of suggestion in learning.", "B a particular technique for learning based on emotions.", "C the effects of emotion on the imagination and the unconscious.", "D ways of learning which are not traditional."], "correctAnswer": r_keys[27], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 3, Question 27, Answer Key page 153"},
        {"questionNumber": 28, "type": "multiple_choice", "question": "Lozanov's theory claims that, when we try to remember things, (Question 28)", "options": ["A unimportant details are the easiest to recall.", "B concentrating hard produces the best results.", "C the most significant facts are most easily recalled.", "D peripheral vision is not important."], "correctAnswer": r_keys[28], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 3, Question 28, Answer Key page 153"},
        {"questionNumber": 29, "type": "multiple_choice", "question": "In this passage, the author uses the examples of a book and a lecture to illustrate that (Question 29)", "options": ["A both of these are important for developing concentration.", "B his theory about methods of learning is valid.", "C reading is a better technique for learning than listening.", "D we can remember things more easily under hypnosis."], "correctAnswer": r_keys[29], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 3, Question 29, Answer Key page 153"},
        {"questionNumber": 30, "type": "multiple_choice", "question": "Lozanov claims that teachers should train students to (Question 30)", "options": ["A memorise details of the curriculum.", "B develop their own sets of indirect instructions.", "C think about something other than the curriculum content.", "D avoid overloading the capacity of the brain."], "correctAnswer": r_keys[30], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 3, Question 30, Answer Key page 153"},
        {"questionNumber": 31, "type": "true_false_not_given", "question": "In the example of suggestopedic teaching in the fourth paragraph, the only variable that changes is the music.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[31], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 3, Question 31, Answer Key page 153"},
        {"questionNumber": 32, "type": "true_false_not_given", "question": "Prior to the suggestopedia class, students are made aware that the language experience will be demanding.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[32], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 3, Question 32, Answer Key page 153"},
        {"questionNumber": 33, "type": "true_false_not_given", "question": "In the follow-up class, the teaching activities are similar to those used in conventional classes.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[33], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 3, Question 33, Answer Key page 153"},
        {"questionNumber": 34, "type": "true_false_not_given", "question": "As an indirect benefit, students notice improvements in their memory.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[34], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 3, Question 34, Answer Key page 153"},
        {"questionNumber": 35, "type": "true_false_not_given", "question": "Teachers say they prefer suggestopedia to traditional approaches to language teaching.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[35], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 3, Question 35, Answer Key page 153"},
        {"questionNumber": 36, "type": "true_false_not_given", "question": "Students in a suggestopedia class retain more new vocabulary than those in ordinary classes.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[36], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 3, Question 36, Answer Key page 153"},
        {"questionNumber": 37, "type": "summary_completion", "question": "Suggestopedia Summary: However, Lozanov admits that a certain amount of 37 ......................................... is necessary in order to convince students...", "options": p3_summary_opts, "correctAnswer": r_keys[37], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 3, Question 37, Answer Key page 153"},
        {"questionNumber": 38, "type": "summary_completion", "question": "Suggestopedia Summary: ...even if this is just a 38 ......................................... .", "options": p3_summary_opts, "correctAnswer": r_keys[38], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 3, Question 38, Answer Key page 153"},
        {"questionNumber": 39, "type": "summary_completion", "question": "Suggestopedia Summary: Although Lozanov's method has become quite 39 ......................................... ...", "options": p3_summary_opts, "correctAnswer": r_keys[39], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 3, Question 39, Answer Key page 153"},
        {"questionNumber": 40, "type": "summary_completion", "question": "Suggestopedia Summary: ...the results of most other teachers using this method have been 40 ......................................... .", "options": p3_summary_opts, "correctAnswer": r_keys[40], "sourceRef": "Cambridge IELTS 7, Test 1, Reading Passage 3, Question 40, Answer Key page 153"}
    ]

    reading_passages = [
        {"id": "cam07-academic-t1-r1", "section": "1", "track": "academic", "cefrLevel": "B2", "difficultyBand": "6.5", "title": "Test 1 Reading Passage 1: Bats to the Present", "module": "academic", "notes": "Evolution of nocturnal navigation, mammalian evolutionary history, echolocation principles and Donald Griffin's pioneering discovery of sonar in bats.", "sourceUrl": "https://www.cambridgeenglish.org/exams-and-tests/ielts/", "passageJson": json.dumps(p1_paras, ensure_ascii=False), "questionsJson": json.dumps(q_p1, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice test material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-1/reading/passage-1"},
        {"id": "cam07-academic-t1-r2", "section": "2", "track": "academic", "cefrLevel": "C1", "difficultyBand": "7.0", "title": "Test 1 Reading Passage 2: Making Every Drop Count", "module": "academic", "notes": "History of water resource management, global clean water sanitation challenges, environmental impacts of massive dams and modern shifts towards water conservation efficiency.", "sourceUrl": "https://www.cambridgeenglish.org/exams-and-tests/ielts/", "passageJson": json.dumps(p2_paras, ensure_ascii=False), "questionsJson": json.dumps(q_p2, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice test material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-1/reading/passage-2"},
        {"id": "cam07-academic-t1-r3", "section": "3", "track": "academic", "cefrLevel": "C1", "difficultyBand": "7.5", "title": "Test 1 Reading Passage 3: Educating Psyche", "module": "academic", "notes": "Examination of Lozanov's suggestopedia, peripheral subconscious learning, classical and baroque musical accompaniment, and the role of ritual as psychological placebo.", "sourceUrl": "https://www.cambridgeenglish.org/exams-and-tests/ielts/", "passageJson": json.dumps(p3_paras, ensure_ascii=False), "questionsJson": json.dumps(q_p3, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice test material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-1/reading/passage-3"}
    ]

    # --- 3. WRITING TOPICS & MODELS ---
    writing_topics = [
        {
            "id": "cam07-academic-t1-w1",
            "track": "academic",
            "prompt": "You should spend about 20 minutes on this task.\n\nThe table below gives information on consumer spending on different items in five countries in 2002.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.\n\nPercentage of national consumer expenditure by category - 2002\n- Ireland: Food/Drinks/Tobacco 28.91%, Clothing/Footwear 6.43%, Leisure/Education 2.21%\n- Italy: Food/Drinks/Tobacco 16.36%, Clothing/Footwear 9.00%, Leisure/Education 3.20%\n- Spain: Food/Drinks/Tobacco 18.80%, Clothing/Footwear 6.51%, Leisure/Education 1.98%\n- Sweden: Food/Drinks/Tobacco 15.77%, Clothing/Footwear 5.40%, Leisure/Education 3.22%\n- Turkey: Food/Drinks/Tobacco 32.14%, Clothing/Footwear 6.63%, Leisure/Education 4.35%",
            "type": "report",
            "typeVi": "Báo cáo số liệu bảng biểu (Table Analysis)",
            "bandRange": "6.0-9.0",
            "outlineJson": json.dumps({
                "introduction": "Paraphrase the table topic showing national consumer spending proportions across five European nations in 2002 across three commodity sectors.",
                "overview": "Highlight that food, drinks, and tobacco represented the largest expenditure across all five nations, while leisure and education consistently accounted for the lowest share.",
                "body1": "Compare food/drinks/tobacco expenditures: Turkey (32.14%) and Ireland (28.91%) highest, versus Italy, Spain, and Sweden under 19%.",
                "body2": "Analyze clothing/footwear and leisure/education: Italy highest in clothing (9.00%), Turkey highest in leisure/education (4.35%), with Sweden and Spain recording the lowest shares respectively."
            }, ensure_ascii=False),
            "keyVocabJson": json.dumps([
                "consumer expenditure", "allocated the largest proportion", "clothing and footwear",
                "leisure and education", "marked disparity", "represented the lowest percentage"
            ], ensure_ascii=False),
            "source": "cambridge-ielts-07-scan",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-1/writing/task-1"
        },
        {
            "id": "cam07-academic-t1-w2",
            "track": "academic",
            "prompt": "You should spend about 40 minutes on this task.\n\nWrite about the following topic:\n\nIt is generally believed that some people are born with certain talents, for instance for sport or music, and others are not. However, it is sometimes claimed that any child can be taught to become a good sports person or musician.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.",
            "type": "discussion_essay",
            "typeVi": "Bài luận thảo luận hai luồng ý kiến (Discuss Both Views and Give Opinion)",
            "bandRange": "6.0-9.0",
            "outlineJson": json.dumps({
                "introduction": "Introduce debate between innate genetic talent versus rigorous pedagogical training in mastering athletic and musical domains. State balanced personal position.",
                "body1": "Discuss the perspective supporting deliberate training: pedagogy, neural plasticity, consistent practice, and structured coaching enabling skill acquisition.",
                "body2": "Discuss the perspective supporting innate natural talent: genetic predispositions, anatomical advantages, and cognitive instincts that separate elite masters from average performers.",
                "conclusion": "Synthesize nature and nurture: systematic training is vital to realize potential, but extraordinary achievement requires a baseline of natural talent."
            }, ensure_ascii=False),
            "keyVocabJson": json.dumps([
                "innate talent", "guided practice", "nature versus nurture", "predisposition",
                "mutually exclusive", "athletic prowess", "pedagogical instruction"
            ], ensure_ascii=False),
            "source": "cambridge-ielts-07-scan",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-1/writing/task-2"
        }
    ]

    task1_sample_text = clean_text_artifacts("""
Different countries' consumer spendings are quite different. The table shows the vary consumer spending on a seires of intems in the five countries, namely, the Ireland, Italy, Spain, Sweden and Turkey in 2002.

Food, drinks and tobacco were in the most important position on consumer spending in all of the five countries, and in a different percentage. In Ireland and turkey, they were near 30%, while in the other three countries they are under 20%.

Clothing and footwear were the second important consumer spending in these countries. In Italy, they got 9%, and in Sweden, they were 5.4%. In the other three countries, the figure were very similar, all were near 6.5%.

The last consumer spending were leisure and education. In Turkey, they were 4.35%, and in the other four countries the figure were under 4%.

In conclusion, it can be said that in 2002, food, drinks and tabacoo were the most important consumer spending in the five countries, and the different countries' consumer spending were quite different.
""")

    task1_examiner_comment = "This answer focuses on the key features of the information, clearly grouping the countries, using supporting figures and presenting an overview. However, there is no clear reference to what the percentages represent and key comparisons need more expansion. Information is organised with clear signalling and some effective referencing and linking, although not all ideas are clearly linked and the overall progression is achieved by repetition in the final section. The range of vocabulary is rather narrow and just sufficient for the task. The attempt to paraphrase the rubric shows limited flexibility. There are several spelling and word form errors, and quite a lot of repetition. Similarly, the range of sentence forms is not wide, with few examples of complex structures. However, apart from one or two errors in basic grammar, simple structures are accurate and easily understood. (Band 5.5 candidate sample answer)"

    task2_model_text = clean_text_artifacts("""
The relative importance of natural talent and training is a frequent topic of discussion when people try to explain different levels of ability in, for example, sport, art or music.

Obviously, education systems are based on the belief that all children can effectively be taught to acquire different skills, including those associated with sport, art or music. So from our own school experience, we can find plenty of evidence to support the view that a child can acquire these skills with continued teaching and guided practice.

However, some people believe that innate talent is what differentiates a person who has been trained to play a sport or an instrument, from those who become good players. In other words, there is more to the skill than a learned technique, and this extra talent cannot be taught, no matter how good the teacher or how frequently a child practices.

I personally think that some people do have talents that are probably inherited via their genes. Such talents can give individuals a facility for certain skills that allow them to excel, while more hard-working students never manage to reach a comparable level. But, as with all questions of nature versus nurture, they are not mutually exclusive. Good musicians or artists and exceptional sports stars have probably succeeded because of both good training and natural talent. Without the natural talent, continuous training would be neither attractive nor productive, and without the training, the child would not learn how to exploit and develop their talent.

In conclusion, I agree that any child can be taught particular skills, but to be really good in areas such as music, art or sport, then some natural talent is required.
""")

    writing_models = [
        {
            "id": "cam07-academic-t1-wm1",
            "task": 1,
            "track": "academic",
            "topic": "Consumer expenditure proportions across 5 countries in 2002",
            "chartType": "table",
            "chartDescription": "Table showing percentage of national consumer expenditure across five European countries (Ireland, Italy, Spain, Sweden, Turkey) on food/drinks/tobacco, clothing/footwear, and leisure/education in 2002.",
            "prompt": "The table below gives information on consumer spending on different items in five countries in 2002. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            "modelAnswer": task1_sample_text,
            "keyVocabJson": json.dumps(["consumer spending", "proportions", "accounted for", "leisure and education", "clothing and footwear"], ensure_ascii=False),
            "examinerNotesVi": task1_examiner_comment,
            "bandEstimate": 5.5,
            "source": "cambridge-ielts-07-scan",
            "license": "Official candidate sample answer (Band 5.5) with examiner comments from Cambridge IELTS 7",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-1/writing/sample-answer-task-1"
        },
        {
            "id": "cam07-academic-t1-wm2",
            "task": 2,
            "track": "academic",
            "topic": "Innate talent versus training and practice in sports and arts",
            "chartType": None,
            "chartDescription": None,
            "prompt": "It is generally believed that some people are born with certain talents, for instance for sport or music, and others are not. However, it is sometimes claimed that any child can be taught to become a good sports person or musician. Discuss both these views and give your own opinion.",
            "modelAnswer": task2_model_text,
            "keyVocabJson": json.dumps(["innate talent", "nature versus nurture", "mutually exclusive", "guided practice", "inherited via their genes", "exploit and develop their talent"], ensure_ascii=False),
            "examinerNotesVi": "Bài mẫu chính thức chuẩn Band 9 do giám khảo Cambridge biên soạn (Official Examiner Model Answer). Lập luận chặt chẽ, phát triển ý tưởng đa chiều, vốn từ vựng học thuật tự nhiên và cấu trúc ngữ pháp mẫu mực.",
            "bandEstimate": 9.0,
            "source": "cambridge-ielts-07-scan",
            "license": "Official examiner model answer from Cambridge IELTS 7",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-1/writing/model-answer-task-2"
        }
    ]

    # --- 4. SPEAKING TOPICS ---
    speaking_topics = [
        {
            "id": "cam07-academic-t1-sp1",
            "part": 1,
            "track": "academic",
            "topic": "Keeping in contact with people",
            "topicVi": "Giữ liên lạc với bạn bè và người thân",
            "question": "How do you usually contact your friends? [Why?]\nDo you prefer to contact different people in different ways? [Why?]\nDo you find it easy to keep in contact with friends and family? [Why/Why not?]\nIn your country, did people in the past keep in contact in the same ways as they do today? [Why/Why not?]",
            "ideasJson": json.dumps([
                "Digital communication channels: instant messaging apps, video calls, social media platforms",
                "Selecting communication mediums based on urgency and relationship closeness (voice call for family, texting for peers)",
                "Time zone challenges vs ease of modern internet connectivity",
                "Generational shift from postal handwritten letters and landlines to real-time smartphones"
            ], ensure_ascii=False),
            "followUpQuestions": "How has social media transformed interpersonal communication in your daily life?",
            "source": "cambridge-ielts-07-scan",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-1/speaking/part-1"
        },
        {
            "id": "cam07-academic-t1-sp2",
            "part": 2,
            "track": "academic",
            "topic": "Describe a party that you enjoyed",
            "topicVi": "Miêu tả một bữa tiệc hoặc buổi liên hoan mà bạn cảm thấy thích thú",
            "question": "Describe a party that you enjoyed.\nYou should say:\n- whose party it was and what it was celebrating\n- where the party was held and who went to it\n- what people did during the party\nand explain what you enjoyed about this party.",
            "ideasJson": json.dumps([
                "Occasion: graduation celebration, milestone birthday, or housewarming gathering",
                "Venue setting: intimate backyard gathering or vibrant banquet restaurant with close friends and relatives",
                "Activities: sharing homemade cuisine, commemorative toasts, board games, karaoke, and reminiscence",
                "Emotional atmosphere: genuine warmth, laughter, stress relief, and deepening personal bonds"
            ], ensure_ascii=False),
            "followUpQuestions": "What makes a party memorable compared to regular social hangouts?",
            "source": "cambridge-ielts-07-scan",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-1/speaking/part-2"
        },
        {
            "id": "cam07-academic-t1-sp3",
            "part": 3,
            "track": "academic",
            "topic": "Family parties & National celebrations",
            "topicVi": "Tiệc gia đình & Lễ kỷ niệm ngày hội quốc gia",
            "question": "Family parties:\n- What are the main reasons why people organise family parties in your country?\n- In some places people spend a lot of money on parties that celebrate special family events. Is this ever true in your country? Do you think this is a good trend or a bad trend?\n- Are there many differences between family parties and parties given by friends? Why do you think this is?\n\nNational celebrations:\n- What kinds of national celebration do you have in your country?\n- Who tends to enjoy national celebrations more: young people or old people? Why?\n- Why do you think some people think that national celebrations are a waste of government money? Would you agree or disagree with this view? Why?",
            "ideasJson": json.dumps([
                "Cultural values placed on filial piety, reunion during traditional holidays, and honoring familial milestones",
                "Ostentatious expenditure versus meaningful hospitality: consumerism pressures vs cultural traditions",
                "Intergenerational dynamics in family gatherings compared to shared contemporary interests among friend groups",
                "National holidays fostering civic solidarity, patriotic education, and economic stimulation through tourism",
                "Debate over public budgetary allocation: civic pride investment versus direct funding for public services"
            ], ensure_ascii=False),
            "followUpQuestions": "How can governments ensure national holidays remain culturally meaningful without excessive public expenditure?",
            "source": "cambridge-ielts-07-scan",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-1/speaking/part-3"
        }
    ]

    return listening_sections, reading_passages, writing_topics, writing_models, speaking_topics
