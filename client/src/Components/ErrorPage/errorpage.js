import { useNavigate }  from 'react-router-dom';
import error404 from '../../assets/error.jpg';

import './errorpage.css'

export default function ErrorPage(){
    const navigate = useNavigate();

    return (
        <>
            <div className="d-flex align-items-center justify-content-center vh-100">
                <div className="text-center row">
                    <div className=" col-md-6">
                        <img src={error404} alt="404" className="img-fluid" />
                    </div>
                    <div className=" col-md-6 mt-5">
                        <p className="fs-3"> <span className="text-danger">Opps!</span> Page not found.</p>
                        <p className="lead">
                            The page you’re looking for doesn’t exist.
                        </p>
                        <span className="btn btn-primary" onClick={() => navigate('/')}>Go Home</span>
                    </div>

                </div>
            </div>
        </>
    );
}