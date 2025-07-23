
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        width: "100%",
        textAlign: "center",
        padding: "1rem 0",
        fontSize: "0.9rem",
        color: "#6c757d",
        background: "transparent",
        letterSpacing: "0.02em",
        marginTop: "auto"
      }}
    >
      &copy; {year} MarketKnowledge. All rights reserved.
    </footer>
  );
}