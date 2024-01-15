import React, { useCallback } from 'react';
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import particlesOptions from "./particles.json";

function TSParticles() {
    const particlesInit = useCallback(main => {
        loadFull(main);
    }, [])

    return (
        <div style={{zIndex:"-1", position:"relative"}}>
            <Particles options={particlesOptions} init={particlesInit}/>
        </div>
    );
}

export default TSParticles;