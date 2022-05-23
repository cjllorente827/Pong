export function translateToCanvas(x, y){

    var canvas = document.getElementById("gameui");
    var context = canvas.getContext('2d');

    var _x = Math.round(canvas.width * x);
    var _y = Math.round(canvas.height * y);

    return [_x, _y];
}

export function getCanvas(){
    return document.getElementById("gameui");
}

export function getContext(){
    var canvas = document.getElementById("gameui");
    var context = canvas.getContext('2d');

    return context;
}

export function pointInRectangle(P, R){
    var within_x = P.x > R.x && P.x < (R.x + R.w);
    var within_y = P.y > R.y && P.y < (R.y + R.h);

    return within_x && within_y;
}


// A and B are two points that form a line segment
// C is the center of the circle
export function intersectsCircle(A, B, C, r){

    // Establish the different sides of the triangle
    var ac = [
        C[0] - A[0],
        C[1] - A[1],
        0
    ];
    
    var ab = [
        B[0] - A[0],
        B[1] - A[1],
        0
    ];    

    var bc = [
        C[0] - B[0],
        C[1] - B[1],
        0
    ];

    //Obtain the distance from circle center to the closest point on the line
    var x = mag(cross(ac, ab)) /  mag(ab) ;

    return x <= r ;
}

export function cross(a, b){

    return [ 
        a[1] * b[2] - a[2] * b[1], 
        a[2] * b[0] - a[0] * b[2], 
        a[0] * b[1] - a[1] * b[0]
    ];
}

export function mag(vector){

    var sum = 0;
    for (let i=0; i < vector.length; i++){
        sum += vector[i] * vector[i];
    }

    return Math.sqrt(sum);
}