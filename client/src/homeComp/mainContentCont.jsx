const MainContent = () => {
  const perks = [
    {
      icon: "⚡",
      title: "Ultra Fast Delivery",
      desc: "Get your favorite gadgets delivered within 24 hours right to your doorstep."
    },
    {
      icon: "🔒",
      title: "Secure Authentication",
      desc: "Protected by industry-standard bCrypt password hashing and JWT token verification."
    },
    {
      icon: "🍃",
      title: "MongoDB Compass",
      desc: "High-performance NoSQL database storing users, products, and order records."
    },
    {
      icon: "🎧",
      title: "24/7 Expert Support",
      desc: "Our dedicated technical team is available around the clock to assist you."
    }
  ];

  return (
    <section className="perks-section fade-in">
      {perks.map((perk, index) => (
        <div key={index} className="perk-card">
          <div className="perk-icon">{perk.icon}</div>
          <div className="perk-info">
            <h4>{perk.title}</h4>
            <p>{perk.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default MainContent;
