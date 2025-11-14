import React from "react";
import "../styles/global.css";
import "../styles/responsive.css";



const GlobalStyles = () => (
  <style>
    {`
      :root {
        --petnet-blue: #3370EB;
        --petnet-yellow: #F9EE7C;
        --petnet-black: #000000;
        --petnet-white: #ffffff;
        --max-width: 1280px;
      }

      body {
        margin: 0;
        font-family: 'Inter', sans-serif;
        color: var(--petnet-black);
        background-color: white;
        scroll-behavior: smooth;
      }

      .container {
        max-width: var(--max-width);
        margin: 0 auto;
        padding: 0 1rem;
      }

      a {
        text-decoration: none;
      }
    `}
  </style>
);

export default GlobalStyles;
