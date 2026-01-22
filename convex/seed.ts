import { mutation, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

const CATEGORIES = [
  { name: "Technology", slug: "technology", color: "#3b82f6", description: "The latest in tech and innovation." },
  { name: "Culture", slug: "culture", color: "#ec4899", description: "Exploring the arts, society, and human experience." },
  { name: "Science", slug: "science", color: "#10b981", description: "Discoveries that shape our understanding of the universe." },
  { name: "Economy", slug: "economy", color: "#f59e0b", description: "Insights into global markets and financial trends." },
  { name: "Politics", slug: "politics", color: "#6366f1", description: "Analysis of global governance and policy." },
];

const ARTICLES_DATA = [
  {
    title: "The Silicon Frontier: Beyond the Limits of Moore's Law",
    slug: "the-silicon-frontier-beyond-the-limits-of-moore-s-law",
    excerpt: "As we approach the physical limits of traditional silicon chips, the industry is pivoting toward radical new architectures and materials.",
    categorySlug: "technology",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    tags: ["Tech", "Hardware", "Future"],
    content: `
      <h2>The End of an Era</h2>
      <p>For decades, Moore's Law has been the guiding light of the semiconductor industry, predicting that the number of transistors on a microchip would double approximately every two years. This relentless pace of innovation has fueled the digital revolution, giving us everything from smartphones to supercomputers. However, we are now reaching a point where transistors are so small that they are approaching the size of single atoms, leading to quantum tunneling and other physical phenomena that make further shrinking extremely difficult.</p>
      
      <h2>Beyond Silicon</h2>
      <p>In response to these challenges, researchers are looking beyond silicon. Materials like graphene and molybdenum disulfide are being explored for their superior electrical properties. These "2D materials" could allow for even thinner and faster transistors, potentially extending the life of Moore's Law or paving the way for entirely new types of computing architectures.</p>
      
      <h2>Quantum and Neuromorphic Computing</h2>
      <p>While new materials are promising, the real revolution might lie in how we process information. Quantum computing, which uses qubits to perform calculations in ways that classical computers cannot, promises to solve problems that are currently intractable. Meanwhile, neuromorphic computing seeks to mimic the architecture of the human brain, offering incredible efficiency for tasks like pattern recognition and artificial intelligence.</p>
      
      <h2>A Global Race</h2>
      <p>The race to define the post-silicon era is not just scientific; it's geopolitical. Countries are investing billions into semiconductor research and domestic manufacturing, recognizing that leadership in this field is essential for national security and economic prosperity. The choices made today will determine the technological landscape for decades to come.</p>
      
      <h2>Conclusion</h2>
      <p>As we stand on the edge of the silicon frontier, the future of computing has never been more uncertain—or more exciting. Whether through new materials, radical architectures, or entirely new paradigms like quantum computing, the journey beyond Moore's Law promises to be a transformative one for all of humanity.</p>
    `
  },
  {
    title: "The Architecture of Silence: Why We Need Quiet Spaces in a Loud World",
    slug: "the-architecture-of-silence-why-we-need-quiet-spaces-in-a-loud-world",
    excerpt: "Exploring the psychological and physiological benefits of quiet environments and how designers are incorporating silence into modern architecture.",
    categorySlug: "culture",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    tags: ["Architecture", "Design", "Wellbeing"],
    content: `
      <h2>The Noise Pandemic</h2>
      <p>In our modern, hyper-connected world, true silence has become a rare luxury. From the constant hum of city traffic to the digital pings of our devices, we are perpetually bathed in sound. This "noise pandemic" isn't just an annoyance; it has profound effects on our mental and physical health, contributing to stress, sleep deprivation, and even cardiovascular disease.</p>
      
      <h2>The Science of Quiet</h2>
      <p>Scientific research increasingly suggests that silence is essential for the brain. Studies have shown that even short periods of quiet can stimulate neurogenesis—the birth of new neurons—in the hippocampus, the area of the brain associated with memory and emotion. Silence allows our brains to enter the "default mode network," a state linked to creativity, self-reflection, and problem-solving.</p>
      
      <h2>Designing for Serenity</h2>
      <p>Recognizing the importance of quiet, architects and urban planners are increasingly prioritizing silence in their designs. From sound-dampening materials to the strategic use of vegetation and water features, modern spaces are being engineered to provide a sanctuary from the noise of the outside world. Libraries, meditation rooms, and even "quiet cars" on trains are becoming increasingly popular as people seek out moments of peace.</p>
      
      <h2>The Cultural Value of Silence</h2>
      <p>Silence also holds deep cultural and spiritual significance. In many traditions, quiet is seen as a prerequisite for wisdom and inner peace. By reclaiming silence in our lives, we are not just improving our health; we are reconnecting with a fundamental human need for stillness and reflection.</p>
      
      <h2>Conclusion</h2>
      <p>In an increasingly loud world, the architecture of silence is more important than ever. By intentionally creating and seeking out quiet spaces, we can protect our health, nurture our creativity, and find a sense of balance in a chaotic world.</p>
    `
  },
  {
    title: "Decoding the Deep: What New Discoveries in Oceanography Mean for Earth's Climate",
    slug: "decoding-the-deep-what-new-discoveries-in-oceanography-mean-for-earth-s-climate",
    excerpt: "New research into the deep ocean is revealing its critical role in regulating our planet's climate and the urgent need for its protection.",
    categorySlug: "science",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    tags: ["Science", "Ocean", "Climate"],
    content: `
      <h2>The Final Frontier</h2>
      <p>The deep ocean, reaching depths of thousands of meters, remains one of the least explored regions on our planet. Yet, it plays a disproportionately large role in regulating Earth's climate. Oceans absorb about 90% of the excess heat generated by global warming and around 25% of all carbon dioxide emissions. Without the deep ocean, our planet would be significantly warmer than it is today.</p>
      
      <h2>Carbon Sequestration in the Deep</h2>
      <p>One of the most critical functions of the deep ocean is the "biological pump." This process involves microscopic organisms absorbing carbon at the surface and then sinking to the deep ocean when they die, effectively locking carbon away for centuries or even millennia. New discoveries are revealing just how efficient—and fragile—this pump truly is.</p>
      
      <h2>The Discovery of New Ecosystems</h2>
      <p>Recent expeditions using advanced submersibles have discovered entirely new ecosystems centered around hydrothermal vents and cold seeps. These environments, which thrive without sunlight, are home to species previously unknown to science. Understanding these organisms and their role in the global carbon cycle is essential for a complete picture of our planet's health.</p>
      
      <h2>The Threat of Plastic and Mining</h2>
      <p>Despite its remote location, the deep ocean is not immune to human impact. Microplastics have been found in the deepest parts of the Mariana Trench, and the prospect of deep-sea mining for rare minerals poses a significant threat to these fragile ecosystems. Protecting the deep ocean is no longer a matter of scientific curiosity; it's a necessity for climate stability.</p>
      
      <h2>Conclusion</h2>
      <p>As we continue to decode the mysteries of the deep, it becomes increasingly clear that the health of the ocean is inextricably linked to the health of the planet. By investing in oceanographic research and establishing marine protected areas, we can ensure that the deep ocean continues to serve as a vital buffer against climate change.</p>
    `
  },
  {
    title: "The Global Shift: How Emerging Markets are Redefining the Financial Order",
    slug: "the-global-shift-how-emerging-markets-are-redefining-the-financial-order",
    excerpt: "The traditional economic hierarchy is being challenged as emerging markets gain influence and develop new financial models.",
    categorySlug: "economy",
    imageUrl: "https://images.unsplash.com/photo-1611974717483-9b2502283aa0?auto=format&fit=crop&w=1200&q=80",
    tags: ["Finance", "Economy", "Markets"],
    content: `
      <h2>A New Economic Center of Gravity</h2>
      <p>For most of the post-WWII era, the global economy was dominated by the G7 nations. However, the 21st century is seeing a significant shift. Emerging markets, led by the BRICS nations and other rising economies in Southeast Asia and Africa, now account for a larger share of global GDP growth than developed nations. This shift is not just about size; it's about influence.</p>
      
      <h2>The Rise of Regional Trade</h2>
      <p>One of the most notable trends is the increase in regional trade and the move away from the US dollar as the primary anchor for international transactions. Bilateral trade agreements and the development of regional payment systems are creating a more fragmented but potentially more resilient global financial system.</p>
      
      <h2>Fintech and Financial Inclusion</h2>
      <p>Emerging markets are often at the forefront of financial technology. In regions where traditional banking infrastructure is lacking, mobile-first financial services have flourished, bringing millions of people into the formal economy. This "leapfrogging" of traditional systems is providing a model for financial inclusion that developed nations are now beginning to study.</p>
      
      <h2>The Challenges of Growth</h2>
      <p>While the growth of emerging markets offers tremendous opportunities, it also presents significant challenges. Debt sustainability, political stability, and the impact of climate change are all critical issues that must be navigated. The transition to a more multi-polar financial order will require new forms of international cooperation and a rethinking of global governance.</p>
      
      <h2>Conclusion</h2>
      <p>The global economic shift is a defining feature of our time. As emerging markets continue to rise, they will not only change the balance of power but also introduce new ideas and models that will reshape the global financial order for the better.</p>
    `
  },
  {
    title: "Digital Sovereignty: The Battle for Control in the Age of Global Networks",
    slug: "digital-sovereignty-the-battle-for-control-in-the-age-of-global-networks",
    excerpt: "Nations are increasingly asserting control over their digital borders, leading to a complex landscape of regulations and technological competition.",
    categorySlug: "politics",
    imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80",
    tags: ["Politics", "Tech", "Privacy"],
    content: `
      <h2>The End of the Borderless Internet</h2>
      <p>The early dream of the internet was one of a borderless world where information could flow freely regardless of national boundaries. Today, that vision is being replaced by the concept of digital sovereignty. Governments around the world are increasingly asserting control over data, infrastructure, and content within their borders, fundamentally reshaping the nature of the global network.</p>
      
      <h2>Data Localization and Privacy</h2>
      <p>One of the primary drivers of digital sovereignty is the desire to protect citizen privacy and national security. Laws requiring data to be stored locally (data localization) and mandates for explicit user consent are becoming the norm. While these measures can enhance privacy, they also create significant hurdles for global tech companies and can lead to a fragmented "splinternet."</p>
      
      <h2>The Geopolitics of Technology</h2>
      <p>Digital sovereignty is also a tool of geopolitical competition. Control over critical technologies like 5G, semiconductors, and artificial intelligence is seen as essential for national power. This has led to export controls, investment screenings, and a race to build "national champions" in key tech sectors.</p>
      
      <h2>The Risks of Fragmentation</h2>
      <p>While the desire for digital sovereignty is understandable, it carries significant risks. A fragmented internet could stifle innovation, impede international cooperation on issues like climate change and pandemics, and be used by authoritarian regimes to suppress dissent. Finding a balance between national interests and the benefits of a global network is one of the great political challenges of our time.</p>
      
      <h2>Conclusion</h2>
      <p>The battle for digital sovereignty is just beginning. How it unfolds will determine the future of the internet, the nature of privacy, and the balance of power in the 21st century.</p>
    `
  },
  {
    title: "AI and the Future of Work: A Human-Centric Perspective on Automation",
    slug: "ai-and-the-future-of-work-a-human-centric-perspective-on-automation",
    excerpt: "As AI becomes more sophisticated, we must rethink the relationship between humans and machines to ensure a future where both can thrive.",
    categorySlug: "technology",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    tags: ["AI", "Work", "Future"],
    content: `
      <h2>The Automation Anxiety</h2>
      <p>The rise of artificial intelligence has sparked a new wave of "automation anxiety." Concerns about mass technological unemployment are common, with fears that AI will replace everything from truck drivers to lawyers. However, history suggests that technology more often shifts the nature of work rather than eliminating it entirely.</p>
      
      <h2>Augmentation vs. Replacement</h2>
      <p>The most likely future is one of augmentation, where AI handles routine and repetitive tasks, allowing humans to focus on higher-level activities that require empathy, creativity, and complex judgment. By embracing AI as a tool rather than a competitor, we can unlock new levels of productivity and job satisfaction.</p>
      
      <h2>The Need for Lifelong Learning</h2>
      <p>The rapid pace of AI development means that the skills needed for the workplace are constantly changing. Lifelong learning is no longer a buzzword; it's a necessity. Educational systems and workplaces must adapt to provide people with the tools to transition and thrive in an AI-driven economy.</p>
      
      <h2>Ensuring Equitable Outcomes</h2>
      <p>As with any technological revolution, the benefits of AI are not guaranteed to be distributed equally. Ensuring that the gains of automation lead to a better future for everyone requires proactive policy intervention, including social safety nets, retraining programs, and ethical guidelines for AI development.</p>
    `
  },
  {
    title: "The Renaissance of Craft: Why Handmade Goods are Making a Comeback in the Digital Age",
    slug: "the-renaissance-of-craft-why-handmade-goods-are-making-a-comeback-in-the-digital-age",
    excerpt: "In an age of mass production, there is a growing appreciation for the unique, the artisanal, and the human-made.",
    categorySlug: "culture",
    imageUrl: "https://images.unsplash.com/photo-1514525253344-4856f71660d1?auto=format&fit=crop&w=1200&q=80",
    tags: ["Culture", "Craft", "SlowLiving"],
    content: `
      <h2>The Allure of the Unique</h2>
      <p>In a world saturated with identical, mass-produced goods, many people are finding a renewed appreciation for things that are unique. Handmade products carry the story of their maker, reflecting a level of care and attention to detail that is impossible to replicate in a factory. This shift is part of a broader move toward "slow living" and a rejection of disposable culture.</p>
      
      <h2>The Rise of the Maker Movement</h2>
      <p>The internet, surprisingly, has played a key role in the craft renaissance. Platforms like Etsy and Instagram have allowed artisans to find a global audience, while online tutorials and maker spaces have made it easier for people to learn traditional crafts themselves. This democratization of production is empowering individuals to become creators rather than just consumers.</p>
      
      <h2>Sustainability and Craft</h2>
      <p>Crafting is often more sustainable than mass production. Small-scale makers typically use fewer resources, produce less waste, and create products that are built to last. By choosing handmade goods, consumers are often making a more environmentally conscious choice.</p>
      
      <h2>Conclusion</h2>
      <p>The renaissance of craft is a testament to the enduring human desire for connection, authenticity, and beauty. In our increasingly digital age, the tactile and the handmade provide a grounding influence and a reminder of our creative potential.</p>
    `
  },
  {
    title: "Stargazing at the Edge of Time: The Next Decade of Space Exploration",
    slug: "stargazing-at-the-edge-of-time-the-next-decade-of-space-exploration",
    excerpt: "From missions to Mars to telescopes that can see the dawn of time, we are entering a golden age of astronomical discovery.",
    categorySlug: "science",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
    tags: ["Space", "Science", "Discovery"],
    content: `
      <h2>A New Chapter in Space</h2>
      <p>After decades of relatively incremental progress, space exploration is entering a period of rapid acceleration. The next decade promises to be one of the most exciting in history, with missions that will challenge our understanding of the universe and our place within it.</p>
      
      <h2>Returning to the Moon and Beyond</h2>
      <p>The Artemis program aims to return humans to the Moon, this time with the goal of establishing a sustainable presence. This will serve as a stepping stone for the ultimate prize: Mars. Privatization of space travel is also playing a huge role, driving down costs and increasing the frequency of launches.</p>
      
      <h2>The Search for Life</h2>
      <p>Advanced telescopes and robotic missions are narrowing in on the search for life beyond Earth. Whether in the subsurface oceans of Europa or the atmosphere of distant exoplanets, the detection of biosignatures would be a landmark event in human history.</p>
      
      <h2>Conclusion</h2>
      <p>The exploration of space is not just about scientific discovery; it's about the expansion of the human imagination. As we gaze at the edge of time, we are ultimately looking for our own place in the cosmos.</p>
    `
  },
  {
    title: "The Circular Economy: Moving Beyond the Take-Make-Waste Model",
    slug: "the-circular-economy-moving-beyond-the-take-make-waste-model",
    excerpt: "Rethinking our relationship with resources is essential for a sustainable future. Discover how the circular economy is changing the way we produce and consume.",
    categorySlug: "economy",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf32d?auto=format&fit=crop&w=1200&q=80",
    tags: ["Sustainability", "Economy", "Green"],
    content: `
      <h2>The Problem with Linear Growth</h2>
      <p>Our traditional economic model is linear: we take raw materials from the earth, make products from them, and then dispose of them as waste. This "take-make-waste" model is fundamentally unsustainable on a planet with finite resources and a growing population.</p>
      
      <h2>The Circular Alternative</h2>
      <p>A circular economy seeks to decouple economic growth from resource consumption. By designing for longevity, repairability, and recyclability, we can keep materials in use for as long as possible. Waste, in this model, becomes a resource for the next production cycle.</p>
      
      <h2>The Business Case for Circularity</h2>
      <p>Moving toward circularity isn't just good for the environment; it makes good business sense. It can lead to cost savings, increased resilience to supply chain disruptions, and the creation of new markets and jobs. Companies that embrace circularity are better positioned to thrive in a resource-constrained world.</p>
      
      <h2>Conclusion</h2>
      <p>The transition to a circular economy is a massive undertaking, but it is one that we must embrace. By rethinking our relationship with resources, we can build a more sustainable and prosperous future for all.</p>
    `
  },
  {
    title: "Climate Diplomacy: Navigating the Complexities of International Environmental Treaties",
    slug: "climate-diplomacy-navigating-the-complexities-of-international-environmental-treaties",
    excerpt: "As the impacts of climate change accelerate, the role of international diplomacy in coordinating a global response has never been more critical.",
    categorySlug: "politics",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    tags: ["Politics", "Climate", "Global"],
    content: `
      <h2>The Challenge of Collective Action</h2>
      <p>Climate change is a global problem that requires a global solution. However, achieving collective action among nearly 200 sovereign nations with vastly different interests and levels of development is incredibly difficult. This is the heart of climate diplomacy.</p>
      
      <h2>From Paris to the Present</h2>
      <p>The Paris Agreement was a landmark achievement in climate diplomacy, establishing a framework for national commitments to reduce emissions. However, the subsequent years have shown that commitments alone are not enough. The focus is now shifting toward implementation, accountability, and the provision of financial support for developing nations.</p>
      
      <h2>The Rise of Sub-National and Non-State Actors</h2>
      <p>Diplomacy is no longer just for nations. Cities, states, and even major corporations are increasingly taking the lead in climate action, forming their own alliances and setting their own targets. This multi-layered approach is essential for building momentum and driving change at all levels of society.</p>
      
      <h2>Conclusion</h2>
      <p>Climate diplomacy is a slow and often frustrating process, but it is the only way to coordinate a global response to the greatest threat facing our planet. By persisting in the face of complexity, we can build the cooperation needed to ensure a livable future.</p>
    `
  }
];

export const clearArticles = mutation({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").collect();
    for (const article of articles) {
      await ctx.db.delete(article._id);
    }

    const articleMedia = await ctx.db.query("articleMedia").collect();
    for (const am of articleMedia) {
      await ctx.db.delete(am._id);
    }

    const mediaList = await ctx.db.query("media").collect();
    for (const m of mediaList) {
      try {
        await ctx.storage.delete(m.storageId);
      } catch (e) {
        console.error(`Failed to delete storage item ${m.storageId}:`, e);
      }
      await ctx.db.delete(m._id);
    }

    return {
      articlesDeleted: articles.length,
      mediaDeleted: mediaList.length,
      associationsDeleted: articleMedia.length,
    };
  },
});

export const runSeed = internalAction({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // 1. Clear existing
    await ctx.runMutation(api.seed.clearArticles);

    // 2. Ensure Author exists (using a mutation)
    const authorId = await ctx.runMutation(api.seed.ensureAuthor, {
      name: "Julian Sterling",
      email: "editor@chronicle.com",
      bio: "Senior Editor at Chronicle. Passionate about long-form journalism and the intersection of technology and human story.",
      role: "admin",
    });

    // 3. Ensure Categories exist
    const categoryMap: Record<string, string> = {};
    for (const cat of CATEGORIES) {
      const id = await ctx.runMutation(api.seed.ensureCategory, cat);
      categoryMap[cat.slug] = id;
    }

    // 4. Insert Articles
    let articlesCreated = 0;
    for (const art of ARTICLES_DATA) {
      // Fetch and store image
      let mediaId = undefined;
      try {
        const response = await fetch(art.imageUrl);
        const blob = await response.blob();
        const storageId = await ctx.storage.store(blob);
        mediaId = await ctx.runMutation(internal.media.saveMediaInternal, {
          storageId,
          filename: `${art.slug}.jpg`,
          mimeType: "image/jpeg",
          size: blob.size,
          alt: art.title,
          uploadedBy: authorId as any,
        });
      } catch (e) {
        console.error(`Failed to seed image for ${art.title}:`, e);
      }

      const categoryId = categoryMap[art.categorySlug];
      if (categoryId) {
        await ctx.runMutation(internal.articles.createInternal, {
          title: art.title,
          slug: art.slug,
          excerpt: art.excerpt,
          content: art.content,
          categoryId: categoryId as any,
          authorId: authorId as any,
          featuredImageId: mediaId as any,
          isFeatured: Math.random() > 0.7,
          tags: art.tags,
        });
        
        // Publish the article immediately
        const article = await ctx.runQuery(api.articles.getBySlug, { slug: art.slug });
        if (article) {
          await ctx.runMutation(internal.articles.publishInternal, { id: article._id });
        }
        
        articlesCreated++;
      }
    }

    return {
      articlesCreated,
    };
  },
});

// Helper mutations
export const ensureAuthor = mutation({
  args: { name: v.string(), email: v.string(), bio: v.string(), role: v.union(v.literal("admin"), v.literal("editor"), v.literal("writer")) },
  handler: async (ctx, args) => {
    let author = await ctx.db.query("authors").withIndex("by_email", q => q.eq("email", args.email)).unique();
    if (!author) {
      return await ctx.db.insert("authors", args);
    }
    return author._id;
  },
});

export const ensureCategory = mutation({
  args: { name: v.string(), slug: v.string(), color: v.string(), description: v.string() },
  handler: async (ctx, args) => {
    let existing = await ctx.db.query("categories").withIndex("by_slug", q => q.eq("slug", args.slug)).unique();
    if (!existing) {
      return await ctx.db.insert("categories", args);
    }
    return existing._id;
  },
});
