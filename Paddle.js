import { getContext, translateToCanvas } from "./util.js";

export class Paddle {
    constructor(rectangle_specifier){
        this.x = rectangle_specifier.x;
        this.y = rectangle_specifier.y;

        this.velocity = 0;

        this.width = rectangle_specifier.width;
        this.height = rectangle_specifier.height;

        this.rect = rectangle_specifier;
    }

    draw() {
        var context = getContext();

        var [canvas_x, canvas_y] = translateToCanvas(this.x, this.y);
        var [canvas_w, canvas_h] = translateToCanvas(this.width, this.height);

        var rectangle = [
            canvas_x,
            canvas_y,
            canvas_w,
            canvas_h
        ];

        context.fillStyle = "black";
        context.fillRect(...rectangle);
    }

}