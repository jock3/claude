/* About.jsx */
function About() {
  const skills = [
    ["Design", "Figma · Sketch · paper"],
    ["Code", "TypeScript · React · CSS"],
    ["Brand", "wordmarks · type · systems"],
    ["Other", "writing · cooking · long walks"],
  ];
  return (
    <section id="about" className="section">
      <div className="shell about">
        <div>
          <span className="eyebrow">About</span>
          <h2 style={{ marginTop: 8 }}>Twelve years in, still figuring it out.</h2>
          <p>
            I'm a designer who codes, or a developer who designs — depending
            on what the project asks for. <strong>I work alone, by choice,</strong>
            and I prefer projects that have a clear shape: a start, a middle,
            and an end you can hold up at a meeting.
          </p>
          <p>
            Before going independent I led design at two startups in Stockholm.
            I've designed type, written a small amount of poetry, and once
            painted a 4-meter mural that nobody asked for.
          </p>
        </div>
        <div>
          <span className="eyebrow">What I do</span>
          <div className="skills" style={{ marginTop: 16 }}>
            {skills.map(([k, v]) => (
              <div className="skill" key={k}>
                <span className="k">{k}</span>
                <span className="v">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

window.About = About;
