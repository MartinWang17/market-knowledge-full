import Link from "next/link";
import Image from "next/image";


export default function FeaturesPage () {

    return (
        <>
        <div className="hero-wrapper" style={{ marginBottom: "2px"}}>
            <div id="hero" className="blurred-container" style={{ marginTop: "32px", marginBottom: "2rem"}}>
                <div>
                    <h1 className="main-heading">
                    Get to know your market on a <span className="green-font">personal level</span> instantly
                    </h1>
                    <p className="lead">
                        Save hours of your time by collecting thousands of relevant conversations within seconds, and extract invaluable information about your customers!
                    </p>
                </div>
            </div>
            <div id="start-scraping" 
                className="d-flex flex-column justify-content-between"
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
            <div id="how-it-works" style={{ maxWidth: "90vw", textAlign: "start", marginBottom: "4rem", marginLeft: "10vw"}}>
                <span className="blue-light"></span>
                <h1 className="main-heading justify-content-start" style={{ marginTop: "5rem" }}>
                    How it <br/><span className="blue-font">Works?</span>
                </h1>
                <div className="hiw-container">
                    <div className="hiw-card">
                        <div>
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