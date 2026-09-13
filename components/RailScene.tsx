/**
 * The hero's 3D scene.
 *
 * Everything here is a static, server-rendered DOM tree: the depth comes from a
 * real CSS 3D viewport (`perspective` on `.scene`) with the ground, rails and
 * sleepers laid flat by `rotateX(76deg)`. Because the rails are drawn as
 * parallel lines *on that plane*, perspective converges them at the horizon on
 * its own — no canvas, no WebGL, no JavaScript, and it paints on first frame.
 *
 * `--px` / `--py` (pointer parallax) are written by <Parallax />; when it never
 * runs, they stay at their neutral `0` defaults and the scene simply sits still.
 */

const STREAKS = [
  { l: "18%", t: "6%", d: "3.1s", delay: "0s", dx: -180 },
  { l: "31%", t: "14%", d: "3.9s", delay: "0.7s", dx: -120 },
  { l: "44%", t: "3%", d: "3.4s", delay: "1.4s", dx: -60 },
  { l: "57%", t: "10%", d: "4.2s", delay: "0.3s", dx: 70 },
  { l: "69%", t: "5%", d: "3.6s", delay: "2.1s", dx: 140 },
  { l: "82%", t: "16%", d: "4.6s", delay: "1.1s", dx: 200 },
];

function Skyline() {
  return (
    <div className="scene-skyline" aria-hidden="true">
      <svg viewBox="0 0 1400 250" preserveAspectRatio="xMidYMax meet" role="presentation">
        <defs>
          <linearGradient id="sky-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d1533" />
            <stop offset="100%" stopColor="#05080f" />
          </linearGradient>
          <linearGradient id="sky-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7ef3ea" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7ef3ea" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g fill="url(#sky-fill)" stroke="url(#sky-rim)" strokeWidth="1.2">
          {/* Left city block — modern towers */}
          <path d="M0 250V150h34v-22h30v22h26V96h44v154z" />
          <path d="M120 250V118h56v-30h26v30h40v132z" />
          <path d="M232 250V166h70v-26h34v110z" />
          {/* Heritage dome + arches — the railway the country already had */}
          <path d="M336 250V176h18v-16h10v16h16v-28a34 34 0 0 1 68 0v28h16v-16h10v16h18v74z" />
          <path d="M388 116a10 10 0 0 1 20 0v14h-20z" />
          {/* Station canopy — the long modern shed over the platforms */}
          <path d="M492 250v-64q104-46 208 0v64z" />
          <path d="M700 250v-64q104-46 208 0v64z" />
          {/* Right city block — glass towers, the modernisation half */}
          <path d="M916 250V128h48v-40h28v40h34v122z" />
          <path d="M1040 250V158h58v-32h24v32h36v92z" />
          <path d="M1176 250V104h40v-26h24v26h38v146z" />
          <path d="M1292 250V170h60v-24h48v104z" />
        </g>

        {/* Lit windows — a city that is awake at 8 AM booking time */}
        <g fill="#7ef3ea" opacity="0.5">
          {[
            [148, 140], [166, 140], [148, 162], [184, 162], [166, 184],
            [258, 190], [278, 190], [258, 212], [934, 150], [956, 150],
            [934, 176], [978, 176], [1060, 180], [1082, 180], [1060, 204],
            [1196, 126], [1218, 126], [1196, 152], [1240, 152], [1196, 178],
            [1312, 192], [1334, 192],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="8" height="12" rx="1.5" />
          ))}
        </g>
        <g fill="#ffc24b" opacity="0.65">
          {[[130, 162], [300, 190], [1002, 176], [1104, 204], [1262, 126], [1356, 192]].map(
            ([x, y], i) => (
              <rect key={i} x={x} y={y} width="8" height="12" rx="1.5" />
            ),
          )}
        </g>

        {/* Overhead line equipment (OHE) masts — electrified, end to end */}
        <g stroke="#7ef3ea" strokeOpacity="0.32" strokeWidth="2" fill="none">
          <path d="M470 250v-96m0 8h-26m26 14h-26" />
          <path d="M930 250v-96m0 8h26m-26 14h26" />
        </g>

        {/* Signal gantry, clear aspect */}
        <g>
          <path d="M1112 250v-86h-4v86z" fill="#0d1533" stroke="#7ef3ea" strokeOpacity="0.3" />
          <circle cx="1110" cy="158" r="5" fill="#34d399" opacity="0.95" />
          <circle cx="1110" cy="158" r="10" fill="#34d399" opacity="0.22" />
        </g>
      </svg>
    </div>
  );
}

function Train() {
  return (
    <div className="scene-train" aria-hidden="true">
      <svg viewBox="0 0 200 160" role="presentation">
        <defs>
          <linearGradient id="nose" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3f7ff" />
            <stop offset="52%" stopColor="#c9d6ee" />
            <stop offset="100%" stopColor="#7586a8" />
          </linearGradient>
          <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1b2b52" />
            <stop offset="100%" stopColor="#060b1a" />
          </linearGradient>
          <radialGradient id="lampGlow">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#7ef3ea" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7ef3ea" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Body: the aerodynamic nose of a modern semi-high-speed set */}
        <path
          d="M40 140V70q0-44 60-44t60 44v70z"
          fill="url(#nose)"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.5"
        />
        {/* Livery: saffron over rail-cyan */}
        <path d="M40 112h120v9H40z" fill="#ff9a2e" />
        <path d="M40 121h120v5H40z" fill="#35e0d4" opacity="0.85" />
        {/* Windscreen */}
        <path
          d="M58 74q0-32 42-32t42 32v20H58z"
          fill="url(#screen)"
          stroke="rgba(126,243,234,0.55)"
          strokeWidth="1.5"
        />
        <path d="M66 70q0-24 34-24" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" fill="none" />
        {/* Headlamps + their wash */}
        <g className="headlamp">
          <circle cx="61" cy="132" r="24" fill="url(#lampGlow)" />
          <circle cx="139" cy="132" r="24" fill="url(#lampGlow)" />
          <rect x="52" y="128" width="18" height="8" rx="4" fill="#f6fdff" />
          <rect x="130" y="128" width="18" height="8" rx="4" fill="#f6fdff" />
        </g>
        {/* Coupler skirt */}
        <path d="M76 140h48v10H76z" fill="#0b1226" opacity="0.9" />
      </svg>
    </div>
  );
}

export default function RailScene() {
  return (
    <div className="scene" aria-hidden="true">
      <div className="scene-sky" />
      <div className="scene-aurora" />
      <div className="scene-stars" />
      <div className="scene-sun" />
      <Skyline />
      <div className="scene-ground" />
      <div className="scene-beam" />
      <div className="scene-rails" />
      <div className="scene-sleepers" />
      <Train />
      <div className="scene-streaks">
        {STREAKS.map((s, i) => (
          <span
            key={i}
            className="streak"
            style={
              {
                "--l": s.l,
                "--t": s.t,
                "--d": s.d,
                "--delay": s.delay,
                "--dx": s.dx,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="scene-vignette" />
    </div>
  );
}
