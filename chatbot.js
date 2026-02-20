/**
 * Chandrabadni Homestay – Free page-source chatbot
 * Answers from website content only; no external API.
 */

(function () {
    // ─── Knowledge from page content (index.html) ───
    const PAGE_KNOWLEDGE = [
        {
            topic: 'about location homestay village temple chandrabadni where',
            text: 'Chandrabadni Homestay is in a serene village with lush green hills and dense oak forests, at the foothills of the sacred Chandrabadni Temple in Tehri, Uttarakhand. It is 400–500 meters from the main highway, in the heart of the village. Distances: 25 km from Devprayag, 100 km from Rishikesh, 25 km from Tehri Dam, 50 km from Srinagar Garhwal.'
        },
        {
            topic: 'experience trekking temple trek nature food organic cycling water',
            text: 'Experiences: Chandrabadni Temple Trek – 4 km scenic forest trek, ancient oak forests, Himalayan viewpoints, quiet spiritual atmosphere, experienced local guides. Nature & Trekking – Oak forest trails, bird watching, photography, meditation, treks to nearby peaks. Authentic Village Life – Traditional Pahadi homestay, organic farming, evening campfires, starry nights. Organic food includes Mandua roti, Jhangora, seasonal vegetables, homemade ghee and chutneys, fresh Pahadi meals, fresh buffalo milk. Cycling – 25 km mountain biking routes (under planning). Tehri Lake water sports – boating, jet skiing, banana rides, surfing – 25 km from village.'
        },
        {
            topic: 'price cost rate pricing stay meals food guide',
            text: 'Transparent pricing: Stay per person per night ₹1,500. Meals (breakfast + lunch + dinner) per person per day ₹800. Local guide per day (shared among group) ₹2,000.'
        },
        {
            topic: 'package tour weekend escape complete experience days nights',
            text: 'Tour packages: Weekend Escape – 3 Days / 2 Nights, ₹5,100–₹5,350 per person. Day 1: Arrival, 500m trek to homestay, welcome tea, village walk, dinner, campfire. Day 2: Chandrabadni Temple trek, Himalayan viewpoints, photography. Day 3: Breakfast, optional hikes or cycling, lunch, departure. Complete Experience – 5 Days / 4 Nights, ₹10,200–₹12,700 per person. Includes arrival, temple trek, forest walk, bird watching, organic farming, local cooking, cycling/mountain biking (25 km), optional Tehri Lake visit, then departure.'
        },
        {
            topic: 'team contact who uttam pramod shailendra narendra phone email whatsapp book',
            text: 'Team: Uttam Singh Panwar – Local Operations Head, 30+ years Tandoor Chef, manages operations and guest coordination. Pramod Singh Panwar – Local Operations Head 2, Retired Indian Army 24 years. Shailendra Singh Panwar – Technology & Marketing, Software Engineer, handles digital marketing and bookings. Narendra Singh Panwar – Strategy & Expansion, Software Engineer 15+ years. Contact: WhatsApp +91 89549 79703, Email chandrabadnihomestay@gmail.com, Location Karas Village, Tehri Garhwal, Uttarakhand. You can book via WhatsApp.'
        },
        {
            topic: 'sustainable eco friendly plastic community',
            text: 'Chandrabadni Homestay is sustainable and responsible: plastic-free zone, small groups only, community-run initiative, income benefits local families, respect for forests, culture and wildlife.'
        }
    ];

    function normalize(s) {
        return (s || '').toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function score(query, topicAndText) {
        const q = normalize(query);
        const t = normalize(topicAndText.topic + ' ' + topicAndText.text);
        const words = q.split(' ').filter(Boolean);
        let score = 0;
        words.forEach(function (w) {
            if (w.length < 2) return;
            if (t.indexOf(w) !== -1) score += 1;
        });
        return score;
    }

    function getAnswer(userMessage) {
        const q = normalize(userMessage);
        if (!q) return "Please ask something about Chandrabadni Homestay (e.g. location, packages, pricing, or contact).";

        const greetings = ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening'];
        if (greetings.some(function (g) { return q === g || q.startsWith(g + ' '); })) {
            return "Hello! I'm the Chandrabadni Homestay assistant. Ask me about location, packages, pricing, experiences, or how to book.";
        }

        var best = { score: 0, text: '' };
        PAGE_KNOWLEDGE.forEach(function (item) {
            var s = score(userMessage, item);
            if (s > best.score) {
                best.score = s;
                best.text = item.text;
            }
        });

        if (best.score > 0 && best.text) {
            return "Based on our website:\n\n" + best.text;
        }

        return "I can only answer from our website content. Try asking about: location, packages, pricing, experiences, team, or contact/booking (WhatsApp +91 89549 79703, email chandrabadnihomestay@gmail.com).";
    }

    // ─── Chat UI ───
    var panelOpen = false;
    var chatHistory = [];

    function createWidget() {
        var root = document.createElement('div');
        root.id = 'chatbot-root';
        root.innerHTML =
            '<button id="chatbot-toggle" type="button" aria-label="Open chat">💬</button>' +
            '<div id="chatbot-panel">' +
            '  <div id="chatbot-header"><span>Chandrabadni Homestay</span><button id="chatbot-close" type="button" aria-label="Close chat">×</button></div>' +
            '  <div id="chatbot-messages"></div>' +
            '  <div id="chatbot-input-wrap">' +
            '    <input id="chatbot-input" type="text" placeholder="Ask about homestay, packages, contact..." />' +
            '    <button id="chatbot-send" type="button">Send</button>' +
            '  </div>' +
            '</div>';
        document.body.appendChild(root);

        var toggle = document.getElementById('chatbot-toggle');
        var panel = document.getElementById('chatbot-panel');
        var closeBtn = document.getElementById('chatbot-close');
        var messagesEl = document.getElementById('chatbot-messages');
        var inputEl = document.getElementById('chatbot-input');
        var sendBtn = document.getElementById('chatbot-send');

        function openPanel() {
            panelOpen = true;
            panel.classList.add('open');
            inputEl.focus();
        }

        function closePanel() {
            panelOpen = false;
            panel.classList.remove('open');
        }

        function addMessage(text, isUser) {
            var div = document.createElement('div');
            div.className = 'chatbot-msg ' + (isUser ? 'user' : 'bot');
            var p = document.createElement('p');
            p.textContent = text;
            div.appendChild(p);
            messagesEl.appendChild(div);
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }

        function send() {
            var text = (inputEl.value || '').trim();
            if (!text) return;
            inputEl.value = '';
            addMessage(text, true);
            chatHistory.push({ role: 'user', content: text });

            var reply = getAnswer(text);
            chatHistory.push({ role: 'bot', content: reply });
            addMessage(reply, false);
        }

        toggle.addEventListener('click', openPanel);
        closeBtn.addEventListener('click', closePanel);
        sendBtn.addEventListener('click', send);
        inputEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); send(); }
        });

        addMessage("Hi! Ask me anything about Chandrabadni Homestay — location, packages, pricing, or how to book.", false);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidget);
    } else {
        createWidget();
    }
})();
