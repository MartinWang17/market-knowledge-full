import Link from "next/link";
import Image from "next/image";


export default function FeaturesPage () {

    return (
        <>
        <span className="blue-light"></span>
        <div className="hero-wrapper" style={{ marginBottom: "2px"}}>
            <div className="row row-cols-12">
                <div id="hero" className="blurred-container p-4 p-md-5" style={{ marginTop: "32px", marginBottom: "2rem"}}>
                    <div>
                        <h1 className="main-heading fs-2 fs-md-1 mb-3">
                        Get to know your market on a <span className="green-font">personal level</span> instantly
                        </h1>
                        <p className="lead">
                            Save hours of your time by collecting thousands of relevant conversations within seconds, and extract invaluable information about your customers!
                        </p>
                    </div>
                </div>
            </div>
            <div id="start-scraping" 
                className="d-flex flex-column justify-content-between row"
                style={{ alignSelf: "center", marginTop: "10rem", marginBottom: "5rem", zIndex: 2 }}>
                <h1 className="main-heading">Know your market now!</h1>
                <Link href="/" className="btn btn-brand btn-lg">
                Start scraping 
                <span style={{ float: "right" }}>
                    <Image
                        src="/market-knowledge-handlogo-transparent.png"
                        alt="market-knowledge logo"
                        width={24}
                        height={24}
                        />
                </span>
                </Link>
            </div>
            <div id="how-it-works">
                <h1 className="main-heading justify-content-start" style={{ marginTop: "5rem" }}>
                    How it <br/><span className="blue-font">Works?</span>
                </h1>
                <div className="hiw-container row row-cols-1 row-cols-md-3 g-4 justify-content-center">
                    <div className="hiw-card">
                        <div>
                            <i className="bi bi-search" style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#285280" }} />
                            <h2 style={{ zIndex: 3 }}>
                                Search
                            </h2>
                            <p className="lead">
                                Search a subreddit related to your target customer, or get even more specific with our keyword search
                            </p>
                        </div>
                    </div>
                    <div className="hiw-card">
                        <div>
                            <i className="bi bi-database" style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#285280" }}></i>
                            <h2>
                                Scrape
                            </h2>
                            <p className="lead">
                                Instantly get access to thousands of discussions
                            </p>
                        </div>
                    </div>
                    <div className="hiw-card">
                        <div>
                            <i className="bi bi-file-earmark-arrow-down" style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#285280" }}></i>
                            <h2>
                                Export
                            </h2>
                            <p className="lead">
                                Export all of your comments as a csv, or copy and paste select comments. Feed this data into your favourite AI chatbot to instantly pull out all the value
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}