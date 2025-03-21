import './Recommendations.scss';

// components
import CardList from './CardList/CardList';

function Recommendations() {
    return (
        <div className="recommendations">
            <div className="container">
                <div className="card-lists">
                    <CardList contentType={`Movies`} />
                    <CardList contentType={`Series`} />
                </div>
            </div>
        </div>
    )
}

export default Recommendations;