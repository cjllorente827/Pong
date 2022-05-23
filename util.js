
// translate x and y in unit coordinates to canvas coordinates
export function translateToCanvas(x, y){

    var canvas = document.getElementById("gameui");
    var context = canvas.getContext('2d');

    var _x = Math.round(canvas.width * x);
    var _y = Math.round(canvas.height * y);

    return [_x, _y];
}

// translate a rectangle specifier into canvas coordinates
export function getTranslatedRectangle(rect){
    var [canvas_x, canvas_y] = translateToCanvas(rect.x, rect.y);
    var [canvas_w, canvas_h] = translateToCanvas(rect.width, rect.height);

    return [
        canvas_x,
        canvas_y,
        canvas_w,
        canvas_h
    ];
}

// get the canvas
export function getCanvas(){
    return document.getElementById("gameui");
}

// get the canvas context
export function getContext(){
    var canvas = document.getElementById("gameui");
    var context = canvas.getContext('2d');

    return context;
}

// determine if a point intersects with a rectangle
export function pointInRectangle(P, R){
    var within_x = P[0] > R[0] && P[0] < (R[0] + R[2]);
    var within_y = P[1] > R[1] && P[1] < (R[1] + R[3]);

    return within_x && within_y;
}


// determine if the line through A and B intersects
// with a circle centered at C with radius r
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

    //Obtain the distance from circle center to the closest point on the line
    var x = mag(cross(ac, ab)) /  mag(ab) ;

    return x <= r ;
}

// return cross product of two vectors
export function cross(a, b){

    return [ 
        a[1] * b[2] - a[2] * b[1], 
        a[2] * b[0] - a[0] * b[2], 
        a[0] * b[1] - a[1] * b[0]
    ];
}

// return magnitude of vector
export function mag(vector){

    var sum = 0;
    for (let i=0; i < vector.length; i++){
        sum += vector[i] * vector[i];
    }

    return Math.sqrt(sum);
}