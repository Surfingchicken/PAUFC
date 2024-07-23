import React, { useState, useEffect } from "react";
import ModifyProfile from "./ModifyProfile"; 
import Contributions from "../bills/Contributions"; 
import { useAuth } from '../../components/auth/AuthContext';

export default function Profile() {
    const auth = useAuth();
    const [activeComponent, setActiveComponent] = useState("ModifyProfile");

    useEffect(() => {
        if (!auth.user?.contribution) {
            setActiveComponent("Contributions");
        }
    }, [auth.user?.contribution]);

    const renderComponent = () => {
        switch (activeComponent) {
            case "ModifyProfile":
                return <ModifyProfile />;
            case "Contributions":
                return <Contributions />;
            default:
                return <ModifyProfile />;        
        }
    };

    return (
        <div>
            <h1>Profil</h1>
            <nav>
                {!auth.user?.contribution && 
                    <>
                        <button onClick={() => setActiveComponent("Contributions")}>Contributions</button>
                        <button onClick={() => setActiveComponent("ModifyProfile")}>Modifier le profil</button>
                    </>
                }
            </nav>
            <hr/>
            {renderComponent()}
            <div className="spaceProfile"></div>
        </div>
    );
}
