import { useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ArticleLayout from "@/components/resources/ArticleLayout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Navbar from "@/components/Navbar"
import api from "@/lib/api"

// ─── Article content ────────────────────────────────────

const articles = {
    "stress-management": {
        title: "Stress Management",
        subtitle: "Practical techniques to navigate daily stress with confidence and resilience.",
        readingTime: 6,
        sections: [
            {
                heading: "Understanding Stress",
                content: "Stress is your body's natural response to perceived threats or challenges. While short bursts of stress can help you perform better, chronic stress erodes your physical and mental health. The first step toward managing stress is recognizing its presence without judgment.",
            },
            {
                heading: "Identify Your Triggers",
                points: [
                    "Keep a stress journal for one week — note when, where, and why you felt stressed",
                    "Recognize patterns: Is it work deadlines? Social situations? Financial concerns?",
                    "Distinguish between stressors you can control and those you cannot",
                    "Notice physical cues: jaw clenching, shallow breathing, muscle tension",
                ],
            },
            {
                heading: "The 4 A's of Stress Management",
                content: "Developed by the Mayo Clinic, the 4 A's offer a practical framework:",
                points: [
                    "Avoid — Remove yourself from unnecessary stressors when possible",
                    "Alter — If you can't avoid a situation, try changing it. Communicate your boundaries",
                    "Adapt — Change your expectations. Reframe problems and look at the bigger picture",
                    "Accept — Some things are beyond your control. Practice acceptance and self-compassion",
                ],
            },
            {
                heading: "Daily Stress-Relief Practices",
                points: [
                    "Start your morning without screens for the first 30 minutes",
                    "Practice the 4-7-8 breathing technique: inhale for 4s, hold for 7s, exhale for 8s",
                    "Take short 5-minute walks throughout the day, especially outdoors",
                    "End each day by writing down three things that went well",
                    "Limit caffeine after 2 PM to improve sleep quality",
                    "Schedule 'worry time' — 15 dedicated minutes to process concerns, then move on",
                ],
            },
            {
                heading: "When to Seek Help",
                content: "If stress feels overwhelming, persistent, or is interfering with your daily life, consider speaking with a mental health professional. Seeking help is a sign of strength, not weakness.",
            },
        ],
        cta: {
            title: "Start Your Stress-Free Journey",
            description: "Try our guided breathing exercise to immediately reduce stress levels.",
            link: "/resources/exercises/box-breathing",
            label: "Try Box Breathing",
        },
    },
    "sleep-hygiene": {
        title: "Sleep Hygiene",
        subtitle: "Build a foundation for restorative sleep with evidence-based practices.",
        readingTime: 5,
        sections: [
            {
                heading: "Why Sleep Matters",
                content: "Sleep is not a luxury — it's a biological necessity. During sleep, your brain consolidates memories, repairs cellular damage, and regulates emotions. Poor sleep is linked to anxiety, depression, weakened immunity, and impaired decision-making.",
            },
            {
                heading: "Creating Your Sleep Environment",
                points: [
                    "Keep your bedroom cool — ideally between 60-67°F (15-19°C)",
                    "Make it dark: use blackout curtains or a sleep mask",
                    "Minimize noise or use a white noise machine",
                    "Reserve your bed for sleep only — avoid working or scrolling in bed",
                    "Invest in comfortable bedding that makes you feel secure",
                ],
            },
            {
                heading: "Building a Wind-Down Routine",
                content: "Your body needs consistent signals that it's time to sleep. Create a 30-60 minute pre-sleep ritual:",
                points: [
                    "Dim the lights one hour before bed",
                    "Stop screen use 30 minutes before sleep — blue light suppresses melatonin",
                    "Try gentle stretching, reading, or listening to calming music",
                    "Take a warm bath or shower — the drop in body temperature promotes drowsiness",
                    "Practice journaling to 'download' your thoughts before sleeping",
                ],
            },
            {
                heading: "Sleep Schedule Tips",
                points: [
                    "Go to bed and wake up at the same time every day — even weekends",
                    "If you can't fall asleep within 20 minutes, get up and do something calming",
                    "Avoid naps longer than 20 minutes, and never nap after 3 PM",
                    "Get morning sunlight exposure within 30 minutes of waking",
                    "Limit caffeine to the first half of your day",
                ],
            },
            {
                heading: "Common Sleep Disruptors",
                points: [
                    "Alcohol may help you fall asleep but disrupts sleep quality later in the night",
                    "Heavy meals before bed can cause discomfort and indigestion",
                    "Anxiety and rumination — try a 'worry journal' before bed",
                    "Inconsistent schedules confuse your circadian rhythm",
                ],
            },
        ],
        cta: {
            title: "Prepare for Better Sleep Tonight",
            description: "Try our sleep meditation with a calming dark-mode breathing session.",
            link: "/resources/meditation/sleep-meditation",
            label: "Start Sleep Meditation",
        },
    },
    "social-connection": {
        title: "Social Connection",
        subtitle: "Build meaningful relationships that nurture your mental health and sense of belonging.",
        readingTime: 5,
        sections: [
            {
                heading: "The Science of Connection",
                content: "Humans are inherently social beings. Research consistently shows that strong social connections reduce anxiety, depression, and even physical illness. Loneliness, on the other hand, is as harmful to health as smoking 15 cigarettes a day. Connection isn't about the number of friends — it's about the quality and depth of your relationships.",
            },
            {
                heading: "Barriers to Connection",
                points: [
                    "Social anxiety or fear of rejection",
                    "Over-reliance on digital communication vs. face-to-face interaction",
                    "Busy schedules that leave little room for socializing",
                    "Past negative experiences that create trust issues",
                    "Moving to a new city or life transition",
                ],
            },
            {
                heading: "Building Deeper Connections",
                points: [
                    "Practice active listening — give full attention, ask follow-up questions",
                    "Be vulnerable: sharing your authentic self invites others to do the same",
                    "Show consistent interest in others' lives, not just when you need support",
                    "Express gratitude and appreciation openly",
                    "Engage in shared activities — hobbies, volunteering, classes",
                    "Prioritize quality time over texting: a coffee date beats 100 messages",
                ],
            },
            {
                heading: "Nurturing Existing Relationships",
                content: "Strong relationships require ongoing investment:",
                points: [
                    "Schedule regular check-ins with close friends or family",
                    "Celebrate others' successes as enthusiastically as your own",
                    "Navigate conflict with curiosity, not hostility",
                    "Respect boundaries — both yours and others'",
                    "Be reliable: follow through on commitments",
                ],
            },
            {
                heading: "Starting Fresh",
                content: "If you're looking to expand your social circle, start small. Join a class, attend a community event, or volunteer for a cause you care about. Remember, meaningful connections take time — be patient with the process and with yourself.",
            },
        ],
        cta: {
            title: "Connect With Your Community",
            description: "Join our anonymous community space to share experiences and support others.",
            link: "/community",
            label: "Visit Community",
        },
    },
    "self-compassion": {
        title: "Self-Compassion",
        subtitle: "Learn to treat yourself with the kindness you freely give to others.",
        readingTime: 6,
        sections: [
            {
                heading: "What Is Self-Compassion?",
                content: "Self-compassion, as defined by Dr. Kristin Neff, involves three core elements: self-kindness instead of self-judgment, common humanity instead of isolation, and mindfulness instead of over-identification with pain. It's not about being soft on yourself — it's about being honest and kind at the same time.",
            },
            {
                heading: "Why We Struggle With It",
                content: "Many of us were taught that being hard on ourselves leads to success. We confuse self-compassion with complacency. But research shows the opposite: self-compassionate people are more motivated, resilient, and emotionally stable than those who practice self-criticism.",
            },
            {
                heading: "The Three Pillars of Self-Compassion",
                points: [
                    "Self-Kindness: Speak to yourself as you would to a close friend in pain",
                    "Common Humanity: Remind yourself that suffering and imperfection are universal — you are not alone",
                    "Mindfulness: Acknowledge your pain without exaggerating or suppressing it",
                ],
            },
            {
                heading: "Daily Self-Compassion Practices",
                points: [
                    "Notice your inner critic: When you catch self-critical thoughts, pause and reframe them",
                    "Write yourself a compassionate letter about something you're struggling with",
                    "Place your hand on your heart when overwhelmed — this activates the parasympathetic nervous system",
                    "Use self-compassion phrases: 'This is a moment of suffering. Suffering is a part of life. May I be kind to myself.'",
                    "Celebrate effort, not just outcomes",
                    "Set realistic expectations — perfection is not the goal, growth is",
                ],
            },
            {
                heading: "The Self-Compassion Break",
                content: "When you're struggling, try this three-step practice: First, acknowledge the difficulty — 'This is really hard right now.' Second, remember you're not alone — 'Other people feel this way too.' Third, offer yourself kindness — 'May I give myself the compassion I need.'",
            },
            {
                heading: "Self-Compassion vs. Self-Esteem",
                content: "Self-esteem depends on external validation and can fluctuate with success or failure. Self-compassion, however, remains constant regardless of circumstances. It doesn't require you to feel better than others — only to treat yourself with the same care you'd offer someone you love.",
            },
        ],
        cta: {
            title: "Practice Self-Love Today",
            description: "Try our Loving Kindness meditation to cultivate compassion for yourself and others.",
            link: "/resources/meditation/loving-kindness",
            label: "Start Loving Kindness",
        },
    },
}

// ─── Component ──────────────────────────────────────────

export default function StrategyPage() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const loggedRef = useRef(false)

    const article = articles[slug]

    // Log article read to backend
    useEffect(() => {
        if (loggedRef.current || !article) return
        loggedRef.current = true
        api.post("/activity", {
            type: "strategy",
            name: article.title,
            slug,
            duration: (article.readingTime || 5) * 60,
        }).catch(err => console.error("Failed to log strategy read:", err))
    }, [slug, article])

    if (!article) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <Navbar />
                <main className="flex-1 flex items-center justify-center mt-32">
                    <div className="text-center">
                        <h2 className="text-2xl font-serif text-foreground mb-4">Article not found</h2>
                        <Button onClick={() => navigate("/resources")} variant="outline" className="rounded-full px-8 py-6">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Resources
                        </Button>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <ArticleLayout
            title={article.title}
            subtitle={article.subtitle}
            readingTime={article.readingTime}
        >
            {article.sections.map((section, i) => (
                <section key={i} className="mb-10">
                    <h2 className="text-2xl font-serif text-foreground mb-4 mt-8">
                        {section.heading}
                    </h2>
                    {section.content && (
                        <p className="text-foreground/80 leading-relaxed mb-4 font-light text-[1.05rem]">
                            {section.content}
                        </p>
                    )}
                    {section.points && (
                        <ul className="space-y-3 ml-1">
                            {section.points.map((point, j) => (
                                <li key={j} className="flex items-start gap-3 text-foreground/80 font-light text-[1.05rem] leading-relaxed">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                                    {point}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            ))}

            {/* CTA Box */}
            {article.cta && (
                <div className="mt-12 p-8 rounded-[2rem] bg-primary/5 border border-primary/10">
                    <h3 className="text-xl font-serif text-foreground mb-2">
                        {article.cta.title}
                    </h3>
                    <p className="text-muted-foreground font-light mb-6">
                        {article.cta.description}
                    </p>
                    <Button
                        onClick={() => navigate(article.cta.link)}
                        className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/15"
                    >
                        {article.cta.label}
                    </Button>
                </div>
            )}
        </ArticleLayout>
    )
}
