import { Persona } from './types';

export const PERSONAS: Persona[] = [
  {
    id: '1',
    name: "Marcus",
    age: 28,
    demographics: "Single male, group home resident, part-time retail worker",
    diagnosis: "Bipolar 1 Disorder (Manic Phase w/ Paranoia)",
    familyHistory: "Estranged from strict religious parents; older brother substance history",
    difficulty: "Acute",
    difficultyLevel: 2,
    initialPrompt: "I'm telling you, the second I tell them I slept four hours, they're calling transport. I’m fine! My mind is just fast right now, okay? Why won't anyone listen?",
    symptoms: [
      { name: "Pressured Speech & Racing Thoughts", unlocked: false, description: "Marcus speaks rapidly and jumps between ideas, indicating a manic phase." },
      { name: "Paranoia regarding Involuntary Hold", unlocked: false, description: "Deep distrust of medical systems and fear of being hospitalized against his will." },
      { name: "Medication Adherence Friction", unlocked: false, description: "A history of stopping medication due to 'brain fog' or feeling 'too slow'." }
    ]
  },
  {
    id: '2',
    name: "Elena",
    age: 34,
    demographics: "Unhoused female, temporary shelter stay, recent job loss",
    diagnosis: "Dual Diagnosis (AUD in withdrawal / PTSD)",
    familyHistory: "Father incarcerated; mother passed from alcohol illness, no contact",
    difficulty: "Crisis",
    difficultyLevel: 3,
    initialPrompt: "Don't look at me like that. I didn't break anything. I just... I need something to stop the shaking, please. My chest is burning and if they make me go back out there today... I can't.",
    symptoms: [
      { name: "Early Alcohol Withdrawal Tremors", unlocked: false, description: "Physical manifestations of withdrawal that require immediate medical attention." },
      { name: "Domestic Violence PTSD Triggers", unlocked: false, description: "Sensitivity to specific tones of voice or proximity that remind her of past abuse." },
      { name: "Severe Housing Insecurity Panic", unlocked: false, description: "Acute anxiety linked to the fear of being returned to the streets." }
    ]
  },
  {
    id: '3',
    name: "Jax",
    age: 22,
    demographics: "College dropout, living alone in studio apartment",
    diagnosis: "Early Psychosis / First-Episode Schizophrenia",
    familyHistory: "Overbearing upper-middle-class parents (dismissive of MH)",
    difficulty: "Mild",
    difficultyLevel: 1,
    initialPrompt: "Don't turn on the light. If you turn on the light, they see shadows under the door. Can't you feel them crawling? Under the skin...",
    symptoms: [
      { name: "Tactile Hallucinations (Formication)", unlocked: false, description: "Feeling things crawling on the skin without external stimuli." },
      { name: "Visual Paranoia & Isolation", unlocked: false, description: "Actively avoiding light and isolating for days due to perceived threats." },
      { name: "Family Minimization Stress", unlocked: false, description: "Pressure from parents to 'snap out of it', causing deep shame." }
    ]
  },
  {
    id: '4',
    name: "Sarah",
    age: 41,
    demographics: "Single mother, part-time accountant, living in rented duplex",
    diagnosis: "Major Depressive Disorder (Severe w/ Suicidal Ideation)",
    familyHistory: "Divorced 2 years ago, custody shared of 2 children",
    difficulty: "Crisis",
    difficultyLevel: 3,
    initialPrompt: "I packed their favorite snacks for school tomorrow and left the folders on the counter. Honestly... everyone would be so much better off without the financial weight I bring. I'm just so tired.",
    symptoms: [
      { name: "Implicit Suicidal Ideation", unlocked: false, description: "Making final arrangements and expressing a desire for 'rest' from life." },
      { name: "Severe Chronic Burnout & Guilt", unlocked: false, description: "Overwhelming feeling of being a failure as a mother and provider." },
      { name: "Depressive Isolation", unlocked: false, description: "Withdrawal from friends and family, making her feel alone in her struggle." }
    ]
  },
  {
    id: '5',
    name: "David",
    age: 55,
    demographics: "Displaced warehouse worker, living with sister",
    diagnosis: "Generalized Anxiety Disorder & Panic Disorder",
    familyHistory: "Widowed 5 years ago, adult daughter lives out of state",
    difficulty: "Acute",
    difficultyLevel: 2,
    initialPrompt: "My chest is tight again. I checked my blood pressure three times, it's fine, but I can't catch air. What if I have a stroke right here while my sister is at work?",
    symptoms: [
      { name: "Somatic Panic Symptoms", unlocked: false, description: "Physical sensations like chest tightness being interpreted as medical emergencies." },
      { name: "Catastrophizing Health Anxieties", unlocked: false, description: "Thinking every symptom is a sign of an impending fatal event." },
      { name: "Loss of Independent Functioning Fear", unlocked: false, description: "Fear that his anxiety makes him a burden on his sister." }
    ]
  },
  {
    id: '6',
    name: "Maya",
    age: 19,
    demographics: "Art college student, renting shared off-campus room",
    diagnosis: "Borderline Personality Disorder (BPD Traits & Emotional Dysregulation)",
    familyHistory: "History of unstable foster placements and turbulent parental bonds",
    difficulty: "Acute",
    difficultyLevel: 2,
    initialPrompt: "You're pulling away, aren't you? Everyone does the second things get messy. Don't sit there and pretend you care when I know you're just writing notes to drop me like everyone else!",
    symptoms: [
      { name: "Acute Abandonment Fears & Splitting", unlocked: false, description: "Viewing the peer supporter as either completely good or completely bad based on cues." },
      { name: "Intense Emotional Dysregulation", unlocked: false, description: "Rapid shifts from anger to sadness to fear." },
      { name: "Impulsive Self-Sabotage Triggers", unlocked: false, description: "A pattern of pushing others away to avoid the pain of being left." }
    ]
  },
  {
    id: '7',
    name: "Robert",
    age: 62,
    demographics: "Retired machinist, living alone in senior public housing",
    diagnosis: "Late-Onset Schizoaffective Disorder & Severe Social Isolation",
    familyHistory: "Lifelong bachelor, no living local relatives",
    difficulty: "Mild",
    difficultyLevel: 1,
    initialPrompt: "I don't need the grocery delivery service. The man in the gray van keeps logging license plates when they park outside. If I don't open the door for three days, they assume nobody's home.",
    symptoms: [
      { name: "Persecutory Delusions", unlocked: false, description: "Belief that he is being watched or monitored by unidentified agents." },
      { name: "Profound Chronic Isolation", unlocked: false, description: "Hasn't spoken to a person outside of essential needs for weeks." },
      { name: "Resistance to External Assistance", unlocked: false, description: "Viewing help as a form of surveillance or intrusion." }
    ]
  },
  {
    id: '8',
    name: "Chloe",
    age: 26,
    demographics: "Freelance graphic designer, living with roommate",
    diagnosis: "Complex PTSD & Dissociative Triggers",
    familyHistory: "No contact with biological family due to childhood trauma",
    difficulty: "Acute",
    difficultyLevel: 2,
    initialPrompt: "Where am I? The walls... they feel too close. Don't touch my shoulder! I heard a loud car door slam outside and suddenly I'm back in the hallway from when I was twelve.",
    symptoms: [
      { name: "Acute Dissociation / Flashback State", unlocked: false, description: "Feeling as though she is currently in a past traumatic environment." },
      { name: "Hyper-reactivity to Startle Triggers", unlocked: false, description: "Exaggerated response to sudden noises like doors slamming." },
      { name: "Somatic Boundary Sensitivity", unlocked: false, description: "Extreme aversion to physical touch or proximity during stress." }
    ]
  }
];
