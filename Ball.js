import { getContext, translateToCanvas } from "./util.js";

export class Ball {
    constructor(circle_specifier){
        this.x = circle_specifier.x;
        this.y = circle_specifier.y;
        this.vx = circle_specifier.vx;
        this.vy = circle_specifier.vy;
        this.radius = circle_specifier.radius;
    }

    draw() {
        var context = getContext();

        var [canvas_x, canvas_y] = translateToCanvas(this.x, this.y);
        var [canvas_r, unused] = translateToCanvas(this.radius, 0);

        var circle = [
            canvas_x,
            canvas_y,
            canvas_r,
            0, 2 * Math.PI
        ];

        context.fillStyle = "black";
        context.beginPath();
        context.arc(...circle);
        context.fill();
    }

}