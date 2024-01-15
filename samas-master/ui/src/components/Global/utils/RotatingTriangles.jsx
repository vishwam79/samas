import React from 'react';
import { RotatingTriangles } from 'react-loader-spinner';

export default function RotatingTrianglesComp() {
    return (
        <div className="react-loader-spinner">
            <RotatingTriangles
                visible={true}
                height="100"
                width="100"
                ariaLabel="rotating-triangels-loading"
                wrapperStyle={{}}
                wrapperClass="rotating-triangels-wrapper"
            />
        </div>
    )
}
