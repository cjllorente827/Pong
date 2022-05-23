import { getContext, translateToCanvas } from "./util.js";

export class Button {
    constructor(text, rectangle_specifier){
        this.text = text;
        this.x = rectangle_specifier.x;
        this.y = rectangle_specifier.y;

        this.width = rectangle_specifier.width;
        this.height = rectangle_specifier.height;
    }

    draw(){
        var context = getContext();

        var [canvas_x, canvas_y] = translateToCanvas(this.x, this.y);
        var [canvas_w, canvas_h] = translateToCanvas(this.width, this.height);

        var center_x = Math.round(canvas_x + canvas_w/2);
        var center_y = Math.round(canvas_y + canvas_h/2);

        var rectangle = [
            canvas_x,
            canvas_y,
            canvas_w,
            canvas_h
        ];

        context.globalAlpha = 0.5;
        context.fillStyle = "black";
        context.fillRect(...rectangle);
        context.globalAlpha = 1;

        context.font = '50pt sans-serif';
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.text, center_x, center_y);
    }

    hasCursor(mousex, mousey){
        
        var [canvas_x, canvas_y] = translateToCanvas(this.x, this.y);
        var [canvas_w, canvas_h] = translateToCanvas(this.width, this.height);

        var within_x = mousex > canvas_x && mousex < (canvas_x + canvas_w);
        var within_y = mousey > canvas_y && mousey < (canvas_y + canvas_h);

        return within_x && within_y;
    }
}