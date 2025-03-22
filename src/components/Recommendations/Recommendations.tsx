import './Recommendations.scss';

// components
import CardList from './CardList/CardList';

function Recommendations() {
    return (
        <section className="recommendations">
            <div className="container">
                <div className="card-lists">
                    <CardList contentType={`Movies`} />
                    <CardList contentType={`TV Shows`} />
                </div>
            </div>
        </section>
    )
}

export default Recommendations;