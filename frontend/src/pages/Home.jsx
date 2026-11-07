import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("English");
  const [translations, setTranslations] = useState({});
  const [translating, setTranslating] = useState(false);

  // ==================================================
  // ALL TEXT USED ON THE HOME PAGE
  // ==================================================

  const englishText = {
    // Navbar
    mission: "Our Mission",
    about: "About",
    howItWorks: "How It Works",

    // Mission
    missionLabel: "OUR MISSION",
    missionTitle1: "Making agricultural",
    missionTitle2: "machinery",
    missionTitle3: "accessible.",
    missionDescription:
      "A smarter way for farmers to discover, access and share agricultural machinery.",

    // Mission Features
    find: "Find",
    share: "Share",
    grow: "Grow",

    findDescription:
      "Discover machinery available near your farm.",

    shareDescription:
      "Connect farmers and make better use of existing resources.",

    growDescription:
      "Reduce machinery costs and improve farming efficiency.",

    // About
    aboutLabel: "ABOUT YANTRA SANCHAY",
    aboutTitle1: "Technology that works",
    aboutTitle2: "for every farmer.",

    aboutDescription:
      "Yantra Sanchay is a smart agricultural machinery network built to connect farmers with the equipment and resources they need.",

    agriculturalMachinery: "Agricultural Machinery",

    agriculturalMachineryDescription:
      "Find tractors, harvesters, cultivators and other agricultural equipment based on your farming requirements.",

    farmerCommunity: "Farmer Community",

    farmerCommunityDescription:
      "Build connections between farmers and make better use of machinery available within local communities.",

    smartTechnology: "Smart Technology",

    smartTechnologyDescription:
      "Use AI-powered assistance, multilingual support and offline-first technology to make the platform accessible to more farmers.",

    ourVision: "OUR VISION",

    visionTitle:
      "A connected agricultural machinery ecosystem.",

    visionDescription:
      "We envision a future where every farmer can easily find the right agricultural machinery, at the right time, without unnecessary cost or difficulty.",

    // How It Works
    howLabel: "HOW IT WORKS",

    howTitle1: "Simple steps.",

    howTitle2: "Smart farming.",

    howDescription:
      "Yantra Sanchay makes it simple for farmers to discover and access agricultural machinery.",

    findMachinery: "Find Machinery",

    findMachineryDescription:
      "Search for the agricultural machinery you need based on your farming activity and location.",

    discoverResources: "Discover Nearby Resources",

    discoverResourcesDescription:
      "Explore machinery available from nearby farmers, owners and agricultural resources.",

    connectShare: "Connect & Share",

    connectShareDescription:
      "Connect with the machinery owner and arrange access or sharing.",

    getWorkDone: "Get the Work Done",

    getWorkDoneDescription:
      "Access the right machinery at the right time and complete your farming activity efficiently.",

    readyToStart: "READY TO GET STARTED?",

    findRightMachinery:
      "Find the right machinery for your farm.",

    findMachineryButton: "Find Machinery",

    // Hero
    technology: "TECHNOLOGY FOR BETTER FARMING",

    heroTitle1: "The right",
    heroTitle2: "machine.",
    heroTitle3: "Right when",
    heroTitle4: "you need it.",

    heroDescription:
      "Yantra Sanchay connects farmers with agricultural machinery, local resources, and smart farming solutions — all in one place.",

    accessPortal: "ACCESS YOUR PORTAL",

    farmer: "Farmer",
    farmerDescription: "Find & access machinery",

    officer: "Officer",
    officerDescription: "Manage & monitor resources",

    // Machinery
    machineryNetwork: "MACHINERY NETWORK ACTIVE",

    availableNearby: "AVAILABLE NEARBY",

    farmMachinery: "Farm Machinery",

    live: "LIVE",

    tractor: "TRACTOR • 45 HP",

    tractorName: "Mahindra 575 DI",

    availableArea: "Available in your area",

    available: "Available",

    startingFrom: "STARTING FROM",

    verticalLabel:
      "FARMERS • MACHINERY • COMMUNITY",

    // Footer
    smartPooling: "SMART MACHINERY POOLING",

    localSharing: "LOCAL RESOURCE SHARING",

    builtForEveryFarmer:
      "BUILT FOR EVERY FARMER",

    scroll: "SCROLL",
  };

  // ==================================================
  // LANGUAGE CODES
  // ==================================================

  const languageCodes = {
    Telugu: "tel_Telu",
    Hindi: "hin_Deva",
    Tamil: "tam_Taml",
    Kannada: "kan_Knda",
    Marathi: "mar_Deva",
  };

  // ==================================================
  // TRANSLATE ONE TEXT
  // ==================================================

  const translateText = async (textValue, targetLanguage) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/translate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            text: textValue,
            source: "eng_Latn",
            target: targetLanguage,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        return data.translated_text;
      }

      console.error(
        "Translation failed:",
        data.error
      );

      return textValue;
    } catch (error) {
      console.error(
        "AI service error:",
        error
      );

      return textValue;
    }
  };

  // ==================================================
  // CHANGE LANGUAGE
  // ==================================================

  const handleLanguageChange = async (event) => {
    const selectedLanguage =
      event.target.value;

    setLanguage(selectedLanguage);

    if (selectedLanguage === "English") {
      setTranslations({});
      setTranslating(false);
      return;
    }

    const targetLanguage =
      languageCodes[selectedLanguage];

    if (!targetLanguage) {
      return;
    }

    setTranslating(true);

    try {
      const translated = {};

      for (const [key, value] of Object.entries(
        englishText
      )) {
        translated[key] =
          await translateText(
            value,
            targetLanguage
          );
      }

      setTranslations(translated);
    } catch (error) {
      console.error(
        "Translation error:",
        error
      );
    } finally {
      setTranslating(false);
    }
  };

  // ==================================================
  // GET DISPLAY TEXT
  // ==================================================

  const text = (key) => {
    if (language === "English") {
      return englishText[key];
    }

    return (
      translations[key] ||
      englishText[key]
    );
  };

  // ==================================================
  // SMOOTH NAVIGATION
  // ==================================================

  const scrollToSection = (sectionId) => {
    const section =
      document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div className="home-page">

      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div className="home-bg">
        <div className="home-overlay"></div>
      </div>

      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <header className="home-navbar">

        {/* LOGO */}

        <div className="home-logo">

          <div className="logo-box">
            🚜
          </div>

          <div>
            <h2>
              Yantra Sanchay
            </h2>

            <span>
              SMART AGRICULTURE NETWORK
            </span>
          </div>

        </div>

        {/* NAVIGATION */}

        <div className="home-nav-right">

          <nav>

            <a
              href="#mission"
              onClick={(e) => {
                //e.preventDefault();
                scrollToSection("mission");
              }}
            >
              {text("mission")}
            </a>

            <a
              href="#about"
              onClick={(e) => {
               // e.preventDefault();
                scrollToSection("about");
              }}
            >
              {text("about")}
            </a>

            <a
              href="#how"
              onClick={(e) => {
              //  e.preventDefault();
                scrollToSection("how");
              }}
            >
              {text("howItWorks")}
            </a>

          </nav>

          {/* LANGUAGE */}

          <div className="language-selector">

            <span className="language-icon">
              🌐
            </span>

            <select
              value={language}
              onChange={
                handleLanguageChange
              }
            >

              <option value="English">
                English
              </option>

              <option value="Telugu">
                తెలుగు
              </option>

              <option value="Hindi">
                हिन्दी
              </option>

              <option value="Tamil">
                தமிழ்
              </option>

              <option value="Kannada">
                ಕನ್ನಡ
              </option>

              <option value="Marathi">
                मराठी
              </option>

            </select>

          </div>

        </div>

      </header>

      {/* ==================================================
          TRANSLATION LOADING
      ================================================== */}

      {translating && (
        <div
          style={{
            position: "fixed",
            top: "90px",
            right: "30px",
            zIndex: 9999,
            padding: "10px 18px",
            borderRadius: "8px",
            background:
              "rgba(0,0,0,0.8)",
            color: "white",
            fontSize: "14px",
          }}
        >
          Translating...
        </div>
      )}

      {/* ==================================================
          HERO
      ================================================== */}

      <main className="home-hero">

        {/* LEFT */}

        <section className="hero-content">

          <div className="hero-tag">

            <span></span>

            {text("technology")}

          </div>

          <h1>

            {text("heroTitle1")}

            <br />

            <i>
              {text("heroTitle2")}
            </i>

            <br />

            {text("heroTitle3")}

            <br />

            {text("heroTitle4")}

          </h1>

          <p>
            {text("heroDescription")}
          </p>

          {/* ACCESS PORTAL */}

          <div className="access-area">

            <div className="access-title">
              {text("accessPortal")}
            </div>

            <div className="access-buttons">

              {/* FARMER */}

              <button
                className="access-card farmer"
                onClick={() =>
                  navigate(
                    "/farmer/login"
                  )
                }
              >

                <div className="access-icon">
                  👨‍🌾
                </div>

                <div className="access-text">

                  <small>
                    01
                  </small>

                  <strong>
                    {text("farmer")}
                  </strong>

                  <span>
                    {text(
                      "farmerDescription"
                    )}
                  </span>

                </div>

                <div className="access-arrow">
                  →
                </div>

              </button>

              {/* OFFICER */}

              <button
                className="access-card officer"
                onClick={() =>
                  navigate(
                    "/officer/login"
                  )
                }
              >

                <div className="access-icon officer">
                  👮
                </div>

                <div className="access-text">

                  <small>
                    02
                  </small>

                  <strong>
                    {text("officer")}
                  </strong>

                  <span>
                    {text(
                      "officerDescription"
                    )}
                  </span>

                </div>

                <div className="access-arrow">
                  →
                </div>

              </button>

            </div>

          </div>

        </section>

        {/* RIGHT VISUAL */}

        <section className="hero-visual">

          <div className="location-badge">

            <span className="location-dot"></span>

            {text(
              "machineryNetwork"
            )}

          </div>

          <div className="machine-card">

            <div className="machine-card-header">

              <div>

                <span>
                  {text(
                    "availableNearby"
                  )}
                </span>

                <h3>
                  {text(
                    "farmMachinery"
                  )}
                </h3>

              </div>

              <div className="live">

                <span></span>

                {text("live")}

              </div>

            </div>

            <div className="machine-picture">

              <div className="machine-circle">
                🚜
              </div>

              <div className="machine-glow"></div>

            </div>

            <div className="machine-details">

              <div>

                <small>
                  {text("tractor")}
                </small>

                <h2>
                  {text(
                    "tractorName"
                  )}
                </h2>

                <p>
                  📍{" "}
                  {text(
                    "availableArea"
                  )}
                </p>

              </div>

              <div className="machine-status">

                <span></span>

                {text("available")}

              </div>

            </div>

            <div className="machine-footer">

              <div>

                <small>
                  {text(
                    "startingFrom"
                  )}
                </small>

              </div>

            </div>

          </div>

          {/* FLOATING STATS */}

          <div className="floating-stat stat-one">

            <strong>
              01
            </strong>

            <span>
              {text("find")}
            </span>

          </div>

          <div className="floating-stat stat-two">

            <strong>
              02
            </strong>

            <span>
              {text("share")}
            </span>

          </div>

          <div className="floating-stat stat-three">

            <strong>
              03
            </strong>

            <span>
              {text("grow")}
            </span>

          </div>

          <div className="vertical-label">
            {text("verticalLabel")}
          </div>

        </section>

      </main>

      {/* ==================================================
          OUR MISSION
      ================================================== */}

      <section
        id="mission"
        className="home-info-section mission-section"
      >

        <div className="section-heading">

          <span>
            {text("missionLabel")}
          </span>

          <h2>

            {text(
              "missionTitle1"
            )}

            <br />

            {text(
              "missionTitle2"
            )}{" "}

            <i>
              {text(
                "missionTitle3"
              )}
            </i>

          </h2>

          <p>
            {text(
              "missionDescription"
            )}
          </p>

        </div>

        <div className="feature-grid">

          {/* FIND */}

          <div className="feature-card">

            <span>
              01
            </span>

            <div className="feature-icon">
              🔎
            </div>

            <h3>
              {text("find")}
            </h3>

            <p>
              {text(
                "findDescription"
              )}
            </p>

          </div>

          {/* SHARE */}

          <div className="feature-card">

            <span>
              02
            </span>

            <div className="feature-icon">
              🤝
            </div>

            <h3>
              {text("share")}
            </h3>

            <p>
              {text(
                "shareDescription"
              )}
            </p>

          </div>

          {/* GROW */}

          <div className="feature-card">

            <span>
              03
            </span>

            <div className="feature-icon">
              🌱
            </div>

            <h3>
              {text("grow")}
            </h3>

            <p>
              {text(
                "growDescription"
              )}
            </p>

          </div>

        </div>

      </section>

      {/* ==================================================
          ABOUT
      ================================================== */}

      <section
        id="about"
        className="home-info-section about-section"
      >

        <div className="section-heading">

          <span>
            {text("aboutLabel")}
          </span>

          <h2>

            {text(
              "aboutTitle1"
            )}

            <br />

            <i>
              {text(
                "aboutTitle2"
              )}
            </i>

          </h2>

          <p>
            {text(
              "aboutDescription"
            )}
          </p>

        </div>

        {/* ABOUT CARDS */}

        <div className="about-content">

          <div className="about-card">

            <div className="about-number">
              01
            </div>

            <div className="about-icon">
              🚜
            </div>

            <h3>
              {text(
                "agriculturalMachinery"
              )}
            </h3>

            <p>
              {text(
                "agriculturalMachineryDescription"
              )}
            </p>

          </div>

          <div className="about-card">

            <div className="about-number">
              02
            </div>

            <div className="about-icon">
              👨‍🌾
            </div>

            <h3>
              {text(
                "farmerCommunity"
              )}
            </h3>

            <p>
              {text(
                "farmerCommunityDescription"
              )}
            </p>

          </div>

          <div className="about-card">

            <div className="about-number">
              03
            </div>

            <div className="about-icon">
              🤖
            </div>

            <h3>
              {text(
                "smartTechnology"
              )}
            </h3>

            <p>
              {text(
                "smartTechnologyDescription"
              )}
            </p>

          </div>

        </div>

        {/* VISION */}

        <div className="about-vision">

          <div className="vision-line"></div>

          <div>

            <span>
              {text("ourVision")}
            </span>

            <h3>
              {text(
                "visionTitle"
              )}
            </h3>

            <p>
              {text(
                "visionDescription"
              )}
            </p>

          </div>

        </div>

      </section>

      {/* ==================================================
          HOW IT WORKS
      ================================================== */}

      <section
        id="how"
        className="home-info-section how-section"
      >

        <div className="section-heading">

          <span>
            {text("howLabel")}
          </span>

          <h2>

            {text(
              "howTitle1"
            )}

            <br />

            <i>
              {text(
                "howTitle2"
              )}
            </i>

          </h2>

          <p>
            {text(
              "howDescription"
            )}
          </p>

        </div>

        {/* STEPS */}

        <div className="how-steps">

          {/* STEP 01 */}

          <div className="how-step">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              🔎
            </div>

            <div className="step-content">

              <span>
                STEP 01
              </span>

              <h3>
                {text(
                  "findMachinery"
                )}
              </h3>

              <p>
                {text(
                  "findMachineryDescription"
                )}
              </p>

            </div>

          </div>

          {/* STEP 02 */}

          <div className="how-step">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              📍
            </div>

            <div className="step-content">

              <span>
                STEP 02
              </span>

              <h3>
                {text(
                  "discoverResources"
                )}
              </h3>

              <p>
                {text(
                  "discoverResourcesDescription"
                )}
              </p>

            </div>

          </div>

          {/* STEP 03 */}

          <div className="how-step">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              🤝
            </div>

            <div className="step-content">

              <span>
                STEP 03
              </span>

              <h3>
                {text(
                  "connectShare"
                )}
              </h3>

              <p>
                {text(
                  "connectShareDescription"
                )}
              </p>

            </div>

          </div>

          {/* STEP 04 */}

          <div className="how-step">

            <div className="step-number">
              04
            </div>

            <div className="step-icon">
              🌾
            </div>

            <div className="step-content">

              <span>
                STEP 04
              </span>

              <h3>
                {text(
                  "getWorkDone"
                )}
              </h3>

              <p>
                {text(
                  "getWorkDoneDescription"
                )}
              </p>

            </div>

          </div>

        </div>

        {/* CTA */}

        <div className="how-cta">

          <div>

            <span>
              {text(
                "readyToStart"
              )}
            </span>

            <h3>
              {text(
                "findRightMachinery"
              )}
            </h3>

          </div>

          <button
            onClick={() =>
              navigate(
                "/farmer/login"
              )
            }
          >
            {text(
              "findMachineryButton"
            )}{" "}
            →
          </button>

        </div>

      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="home-footer">

        <div>

          <span className="footer-line"></span>

          {text(
            "smartPooling"
          )}

        </div>

        <div>

          <span className="footer-line"></span>

          {text(
            "localSharing"
          )}

        </div>

        <div>

          <span className="footer-line"></span>

          {text(
            "builtForEveryFarmer"
          )}

        </div>

        <div className="scroll">

          {text("scroll")}

          <span>
            ↓
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Home;