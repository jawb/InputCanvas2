/*
 * InputCanvas is a Javascript library to add input support to the canvas element
 *
 * @package     InputCanvas
 * @author      Zoli Issam <jawbfl@gmail.com><http://twitter.com/JawBfl>
 * @copyright   (c) 2011-2012 Zoli Issam
 * @license     Licenced under the GPLv3
 * @version     InputCanvas v 2.0
*/


/*
=============================================================================================================================

    * Functions.

=============================================================================================================================
*/

/**
    * Function to simulate CSS parameters omission with a max value.
    * @param int,[] arg : Input.
    * @param int max    : Maximal value
    * @return array
*/
function setNumArr(arg,max)
{
    if(typeof arg === 'number')
    {
        var tmp = parseInt(arg);
        if(max && tmp > max) tmp = max;
        return [tmp, tmp, tmp, tmp];
    }
    else if(typeof arg === 'object')
    {
        for(i=0;i<4;++i) {
            if(!arg[i]) arg[i]=0;
            if(max && arg[i] > max) arg[i] = max; 
        }
        return [ arg[0], arg[1], arg[2], arg[3] ];
    }
    else return [0, 0, 0, 0];
}

/**
    * Cross-browsers addEvent from Nettuts+ by Jeffrey Way 
    * http://net.tutsplus.com/tutorials/javascript-ajax/from-jquery-to-javascript-a-reference
    * This function will simply ensure that both the W3C-recommended event
    * model, addEventListener, and Internet Explorer’s legacy attachEvent are normalized.
    *
    * @param el[]        : Elements
    * @param string type : Event type
    * @param function fn : Listener
    * @return void.
*/
var addEvent = (function () {
   var filter = function(el, type, fn) {
      for ( var i = 0, len = el.length; i < len; ++i ) {
         addEvent(el[i], type, fn);
      }
   };
   if ( document.addEventListener ) {
      return function (el, type, fn) {
         if ( el && el.nodeName || el === window ) {
            el.addEventListener(type, fn, false);
         } else if (el && el.length) {
            filter(el, type, fn);
         }
      };
   }
 
   return function (el, type, fn) {
      if ( el && el.nodeName || el === window ) {
         el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
      } else if ( el && el.length ) {
         filter(el, type, fn);
      }
   };
})();



/*
=============================================================================================================================

    * BasicShape object.

=============================================================================================================================
*/

function BasicShape(x,y,width,height,cursor) {
    // Main proprieties
    this.cursor = cursor || null;

    this.x        = x || 0;                                       // Top left corner X
    this.y        = y || 0;                                       // Top left corner Y
    this.id       = '';                                           // Identifier
    this.mousein  = false;                                        // Mouse status
    this.mouseinp = false;                                        // Mouse previous Status
    this.focus    = false;                                        // Focus status
    this.focusp   = false;                                        // Focus previous status
    this.visible  = true;                                         // Visibility
    this.editable = false;                                        // Editable or static text
    this.lines    = [];
    this.font     = {size:14, color:"#000000", font:"Arial"};

    // Others
    this.width    = width;                                        // Width
    this.height   = height;                                       // Height
    this.padding  = [1, 1, 1, 1];                                 // Padding
    this.border   = {color:"#000000",size:2,radius:[1, 1, 1, 1]}; // Border
    this.shadow   = {color:"000000",blur:0,x:0,y:0};              // Shadow
    this.bg       = "#FFFFFF";                                    // Background color
    this.index    = 0;                                            // CSS z-index like
    
    // Event hundlers.
    this.MouseMove = function (e){};
    this.MouseOver = function (e){console.log("Over:   " + this.id);};
    this.MouseOut  = function (e){console.log("Out :   " + this.id);};
    this.MouseDown = function (e){};
    this.MouseUp   = function (e){};
    this.KeyUp     = function (e){};
    
}

/**
    * Set border proprieties.
    * @param int size      : Size of border in pixel
    * @param string color  : Color of border (Hex)
    * @param int,[] radius : Border radius [top,right,bottom,left]
    * @return void
*/
BasicShape.prototype.SetBorder = function (size, color, radius) {
    this.border.size   = size  || 2;
    this.border.color  = color || "#000000";
    this.border.radius = setNumArr(radius,Math.min(this.width/2,this.height/2));
};

/**
    * Set padding.
    * @param int,[] padding : [top,right,bottom,left]
    * @return void
*/
BasicShape.prototype.SetPadding = function (padding) {
    this.padding = setNumArr(padding);
};

/**
    * Set font proprieties.
    * @param int size      : Size of border in pixel
    * @param string color  : Color of border (Hex)
    * @param string family : Font family
    * @return void
*/
BasicShape.prototype.SetFont = function (size, color, family) {
    this.font.size   = size   || 14;
    this.font.color  = color  || "#000000";
    this.font.family = family || "Arial";
};

/**
    * Set shadow/light proprieties.
    * @param string color : Color of border (Hex)
    * @param int x        : Offset x in pixel
    * @param int y        : Offset y in pixel
    * @param int blur     : Blur.
    * @return void
*/
BasicShape.prototype.SetShadow = function (color, x, y, blur) {
    this.shadow.color  = color || "#000000";
    this.shadow.x      = x || 0;
    this.shadow.y      = y || 0;
    this.shadow.blur   = blur || 0;
};

/**
    * Set background color.
    * @param string color : Background color (Hex)
    * @return void
*/
BasicShape.prototype.SetBackground = function (color) {
    this.bg  = color || "#FFFFFF";
};

/**
    * Set value.
    * @param string value
    * @return void
*/
BasicShape.prototype.SetValue = function (value) {
    value  = value || "";
    this.lines  = value.split("\n");
};

/**
    * Set id.
    * @param string id
    * @return void
*/
BasicShape.prototype.SetId = function (id) {
    this.id  = id || "";
};

/**
    * Set index.
    * @param string index
    * @return void
*/
BasicShape.prototype.SetIndex = function (index) {
    this.index  = index || 0;
};

/**
    * Calculate top left corner X.
    * @return int
*/
BasicShape.prototype.X = function () {
    return this.x-this.border.size/2;
};

/**
    * Calculate top left corner Y.
    * @return int
*/
BasicShape.prototype.Y = function () {
    return this.y-this.border.size/2;
};

/**
    * Calculate top right corner X.
    * @return int
*/
BasicShape.prototype.WidthX = function () {
    return this.x+this.border.size/2+this.width;
};

/**
    * Calculate top right corner Y.
    * @return int
*/
BasicShape.prototype.HeightY = function () {
    return this.y+this.border.size/2+this.height;
};

/**
    * Calculate controls.
    * @return array
*/
BasicShape.prototype.Controls = function () {
    var controls  = [];
    controls[0]   = {x : this.X() , y : this.Y()};
    controls[1]   = {x : this.WidthX() , y : this.Y()};
    controls[2]   = {x : this.WidthX() , y : this.HeightY()};
    controls[3]   = {x : this.X() , y : this.HeightY()};
    return controls;
};

/**
    * Calculate mask's controls.
    * @return array
*/
BasicShape.prototype.Mcontrols = function () {
    var Mcontrols = [];
    Mcontrols[0]  = {x : this.x + this.padding[3] , y : this.y + this.padding[0] };
    Mcontrols[1]  = {x : this.x + this.width - this.padding[1] , y : this.y + this.padding[0] };
    Mcontrols[2]  = {x : this.x + this.width - this.padding[1] , y : this.y + this.height - this.padding[2]};
    Mcontrols[3]  = {x : this.x + this.padding[3] , y : this.y + this.height - this.padding[2]};
    return Mcontrols;
};

/**
    * Calculate lines start.
    * @return array
*/
BasicShape.prototype.LineStart = function () {
    var linestart = [];
    linestart[0]  = {x : this.X() + this.border.radius[0] , y : this.Y()};
    linestart[1]  = {x : this.WidthX() , y : this.Y() + this.border.radius[1]};
    linestart[2]  = {x : this.WidthX() - this.border.radius[2], y : this.HeightY()};
    linestart[3]  = {x : this.X(), y : this.HeightY() - this.border.radius[3]};
    return linestart;
};

/**
    * Calculate lines end.
    * @return array
*/
BasicShape.prototype.LineEnd = function () {
    var lineend   = [];
    lineend[0]    = {x : this.WidthX() - this.border.radius[1] , y : this.Y()};
    lineend[1]    = {x : this.WidthX() , y : this.HeightY() - this.border.radius[2]};
    lineend[2]    = {x : this.X() + this.border.radius[3], y : this.HeightY()};
    lineend[3]    = {x : this.X() , y : this.Y() + this.border.radius[0]};
    return lineend;
};

/**
    * Check if (x,y) is in the region.
    * @param int x
    * @param int y
    * @return boolean
*/
BasicShape.prototype.In = function (x,y,offx,offy) {
    controls = this.Controls();
    x = x - offx;
    y = y - offy;
    if ( this.X() <= x && x <= this.WidthX() && this.Y() <= y && y <= this.HeightY() ) {
        result = [];
        for ( i = 0; i < 4; ++i ) {
            r = this.border.radius[i];
            if (r+this.border.size/2 < 8 ) continue;
            else {
                if (i==0 || i==3) {
                    controls[i].x = controls[i].x + r;
                    condx = x < controls[i].x;
                }
                if (i==1 || i==2) {
                    controls[i].x = controls[i].x - r;
                    condx = x > controls[i].x;
                }
                if (i==0 || i==1) {
                    controls[i].y = controls[i].y + r;
                    condy = y < controls[i].y;
                }
                if (i==2 || i==3) {
                    controls[i].y = controls[i].y - r;
                    condy = y > controls[i].y;
                }

                if ((Math.pow(x-controls[i].x,2) + Math.pow(y-controls[i].y,2)) > Math.pow(r,2) && condx && condy) {
                    result[i] = false;
                }
                else result[i] = true;
            }
        }
        if (result.indexOf(false) == -1) return true;
    }
    else return false;
};

BasicShape.prototype.onMouseMove = function (){};
BasicShape.prototype.onMouseOver = function (){};
BasicShape.prototype.onMouseOut  = function (){};
BasicShape.prototype.onMouseDown = function (){};
BasicShape.prototype.onMouseUp   = function (){};
BasicShape.prototype.onKeyDown   = function (){};
BasicShape.prototype.onKeyUp     = function (){};
BasicShape.prototype.onKeyPress  = function (){};
BasicShape.prototype.onBlur      = function (){};
BasicShape.prototype.onFocus     = function (){};
BasicShape.prototype.onClick     = function (){};

/**
    * Draw input's shape.
    * @param Obj canvas : Reference to the canvas
    * @return void
*/
BasicShape.prototype.Draw = function (context) {

    if( !this.visible ) return;

    var linestart = this.LineStart();
    var lineend   = this.LineEnd();
    var controls  = this.Controls();
    var Mcontrols = this.Mcontrols();

    context.beginPath();
    context.moveTo(linestart[0].x, linestart[0].y);
    context.lineTo(lineend[0].x, lineend[0].y);
    context.arcTo(controls[1].x,controls[1].y,linestart[1].x, linestart[1].y,this.border.radius[1]);
    context.lineTo(lineend[1].x, lineend[1].y);
    context.arcTo(controls[2].x,controls[2].y,linestart[2].x, linestart[2].y,this.border.radius[2]);
    context.lineTo(lineend[2].x, lineend[2].y);
    context.arcTo(controls[3].x,controls[3].y,linestart[3].x, linestart[3].y,this.border.radius[3]);
    context.lineTo(lineend[3].x, lineend[3].y);
    context.arcTo(controls[0].x,controls[0].y,linestart[0].x, linestart[0].y,this.border.radius[0]);
    context.closePath();
    context.strokeStyle   = this.border.color;
    context.lineWidth     = this.border.size;
    context.fillStyle     = this.bg;
    context.shadowColor   = this.shadow.color;
    context.shadowBlur    = this.shadow.blur;
    context.shadowOffsetX = this.shadow.x;
    context.shadowOffsetY = this.shadow.y;
    context.fill();
    context.shadowColor   = 0;
    context.shadowBlur    = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.stroke();

    // Clipping region
    context.save();
    context.beginPath();
    context.rect(Mcontrols[0].x, Mcontrols[0].y, Mcontrols[1].x - Mcontrols[0].x, Mcontrols[3].y - Mcontrols[0].y);
    context.closePath();
    context.clip();

    // Drawing Text
    context.font         = this.font.size+"px "+this.font.family;
    context.fillStyle    = this.font.color;
    context.textBaseline = "top";
    if(this.editable) c = 0;
    else c = this.height/2 - (this.lines.length*this.font.size/2) - this.font.size/4;
    for (i=0;i<this.lines.length;++i)
        context.fillText(this.lines[i], Mcontrols[0].x , Mcontrols[0].y + i*this.font.size + c);
    context.restore();
};

BasicShape.prototype.DrawCursor = function (context) {
    var Mcontrols = this.Mcontrols();
    context.beginPath();
    posx = Mcontrols[0].x + context.measureText(this.lines[this.cursor.j].substring(0,this.cursor.i)).width;
    posy = Mcontrols[0].y + this.cursor.j * this.font.size;
    context.moveTo(posx, posy);
    context.lineTo(posx, posy + this.font.size);
    context.lineWidth = 2;
    context.lineCap = "butt";
    context.strokeStyle = "#000000";
    context.stroke();
    context.closePath();
};


BasicShape.prototype.Blur = function (e) {
    console.log("Blur:   " + this.id);
    if ( this.editable ) {
        this.cursor.i = 0;
        this.cursor.j = 0;
        this.cursor.display = false;
        this.cursor.counter = 0;
    }
    if ( typeof this.onBlur == 'function' ) this.onBlur(e);
};

BasicShape.prototype.Focus = function (e) {
    console.log("Focus:  " + this.id);
    if ( typeof this.onFocus == 'function' ) this.onFocus(e);
};

BasicShape.prototype.Click = function (context,offx,offy,e) {
    console.log("Click:  " + this.id);
    if ( typeof this.onClick == 'function' ) this.onClick(e);
    this.cursor.display = false;
    if ( this.editable ) {
        x = e.x - offx;
        y = e.y - offy;
        var Mcontrols = this.Mcontrols();
        var lines = this.lines;
        for (i=0;i<lines.length;++i) {
            j = Mcontrols[0].y + i*this.font.size;
            if(j<=y && y<=j+this.font.size) {
                this.cursor.j = i;
                this.cursor.display = true;
                this.cursor.counter = 0;
                line = "";
                width = Mcontrols[0].x;
                widthp = Mcontrols[0].x;
                for (ch=0;ch<lines[i].length;++ch) {
                    line = line + lines[i][ch];
                    context.font = this.font.size+"px "+this.font.family;
                    widthp = width;
                    width = Mcontrols[0].x + context.measureText(line).width;
                    if ( widthp<=x && x<=width ) {
                        cx = widthp + (width-widthp)/2;
                        if(x<cx) this.cursor.i = ch;
                        else this.cursor.i = ch+1;
                        return;
                    }
                }
                this.cursor.i = lines[i].length;
                return;
            }
        }
        this.cursor.i = lines[lines.length-1].length;
        this.cursor.j = lines.length-1;
        this.cursor.display = true;
        this.cursor.counter = 0;
    }
};

BasicShape.prototype.KeyDown = function (e) {
    var charCode = (e.which) ? e.which : event.keyCode;
    if (charCode == 37) { // Left
        if(this.cursor.i > 0) {
            --this.cursor.i;
        }
        else if(this.cursor.j > 0) {
            this.cursor.j = this.cursor.j - 1;
            this.cursor.i = this.lines[this.cursor.j].length;
        }
    }
    if (charCode == 39) { // Right
        if(this.cursor.i < this.lines[this.cursor.j].length) {
            ++this.cursor.i;
        }
        else if(this.cursor.j < this.lines.length-1) {
            ++this.cursor.j;
            this.cursor.i = 0;
        }
    }
    if (charCode == 38) { // Up
        if(this.cursor.j > 0) {
            this.cursor.j = this.cursor.j - 1;
            this.cursor.i = Math.min(this.lines[this.cursor.j].length,this.cursor.i);
        }
    }
    if (charCode == 40) { // Down
        if(this.cursor.j < this.lines.length-1) {
            ++this.cursor.j;
            this.cursor.i = Math.min(this.lines[this.cursor.j].length,this.cursor.i);
        }
    }
    if (charCode == 8)  { //Backspace
        if(this.cursor.i > 0) {
            this.cursor.i = this.cursor.i-1;
            this.lines[this.cursor.j] = this.lines[this.cursor.j].substring(0,this.cursor.i)+
                                        this.lines[this.cursor.j].substring(this.cursor.i+1);
        }
        else {
            if(this.cursor.j > 0) {
                str = this.lines[this.cursor.j-1] + this.lines[this.cursor.j];
                this.cursor.i = this.lines[this.cursor.j-1].length;
                this.lines[this.cursor.j-1] = str;
                this.lines.splice(this.cursor.j,1);
                --this.cursor.j;
            }
        }
    }
    if (charCode == 46) { //Delete
        
    }
    if ( typeof this.onKeyDown == 'function' ) this.onKeyDown(e);
};

BasicShape.prototype.KeyPress = function (e) {
    this.lines[this.cursor.j] = this.lines[this.cursor.j].substring(0,this.cursor.i) + String.fromCharCode(e.charCode)+
                                        this.lines[this.cursor.j].substring(this.cursor.i);
    this.cursor.i++;
    if ( typeof this.onKeyPress == 'function' ) this.onKeyPress(e);
};
/*
=============================================================================================================================

    * FormCanvas object.

=============================================================================================================================
*/

function FormCanvas(canvas) {
    this.canvas     = canvas;                                     // HTML canvas element
    this.context    = canvas.getContext("2d");                    // Context of canvas
    this.elements   = [];                                         // Array of elements
    this.start      = false;                                      // Start Drawing
    this.sorted     = false;                                      // Is this.elements sorted
    this.overed     = false;                                      // Mouse over some input
    this.fps        = 30;                                         // Frame per second
    this.cursor     = { i:0, j:0, display:false, view:false,      // Cursor (fps/times)
                       times:2, counter:0 };
    this.CustomDraw = function (){};                              // Draw other things on the canvas
    tForm = this;
    addEvent(canvas,'mousemove',function(e){tForm.MouseMove(e);});
    addEvent(canvas,'click',function(e){tForm.Click(e);});
    addEvent(document,'keydown',function(e){tForm.KeyDown(e);});
    addEvent(document,'keypress',function(e){tForm.KeyPress(e);});
}

/**
    * Initiate Drawing.
    * @return void
*/ 
FormCanvas.prototype.InitDraw = function () {
    var theForm  = this;
    this.start = true;
    this.Draw();
    setInterval(function(){theForm.Draw();},1000/theForm.fps);
};

/**
    * Resume Drawing.
    * @return void
*/
FormCanvas.prototype.Resume = function () {
    this.start = true;
};

/**
    * Stop Drawing.
    * @return void
*/
FormCanvas.prototype.Stop = function () {
    this.start = false
};

/**
    * Add an input to the elements stack.
    * @param int x
    * @param int y
    * @return BasicShape Object
*/
FormCanvas.prototype.AddInput = function (x, y, width, height) {
    var newinput = new BasicShape(x,y,width,height,this.cursor); 
    this.elements.push(newinput);
    this.sorted = false;
    return newinput;
};

/**
    * Pop an input from the elements stack.
    * @param obj input
    * @return void
*/
FormCanvas.prototype.RemoveInput = function (input) {
    this.elements = this.elements.splice(this.elements.indexOf(input), 1);
};

/**
    * Draw all elements.
    * @return void
*/ 
FormCanvas.prototype.Draw = function () {
    if ( !this.start ) return;
    if ( !this.sorted ) {
        this.elements.sort(function (a,b) {
            return a.index - b.index;
        });
        this.sorted = true;
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for ( var i=0; i < this.elements.length; ++i ) {
        this.elements[i].Draw(this.context);
    }
    this.cursor.counter++;
    if( this.cursor.display && this.cursor.counter == this.fps/this.cursor.times) {
        this.cursor.counter = 0;
        this.cursor.view = !this.cursor.view;
    }
    this.DrawCursor();
    if ( typeof this.CustomDraw == 'function' ) this.CustomDraw(this.canvas);
};

/**
    * Draw cursor.
    * @return void
*/ 
FormCanvas.prototype.DrawCursor = function () {
    if ( !this.start ) return;
    if ( !this.cursor.display ) return;
    if ( !this.cursor.view ) return;
    for ( var i=this.elements.length-1; i > -1; --i ) {
        if(this.elements[i].focus) {
            this.elements[i].DrawCursor(this.context);
        }
    }
};

// Event handling

/**
    * Handel mouse move and over/out.
*/
FormCanvas.prototype.MouseMove = function (e) {
    x = e.x;
    y = e.y;
    if (!this.elements) return;
    this.overed = false;
    for ( var i=this.elements.length-1; i > -1; --i ) {
        this.elements[i].mouseinp = this.elements[i].mousein;
        if (this.elements[i].In(x,y,this.canvas.offsetLeft,this.canvas.offsetTop)) {
            if ( this.overed ) {
                this.elements[i].mousein = false;
                if(this.elements[i].mouseinp) this.elements[i].MouseOut(e);
                continue;
            }
            this.overed = true;
            this.elements[i].mousein = true;
            if(!this.elements[i].mouseinp) this.elements[i].MouseOver(e);
        }
        else {
            this.elements[i].mousein = false;
            if(this.elements[i].mouseinp) this.elements[i].MouseOut(e);
        }
    }
};

/**
    * Handle click and focus/blur.
*/
FormCanvas.prototype.Click = function (e) {
    for ( var i=this.elements.length-1; i > -1; --i ) {
        this.elements[i].focusp = this.elements[i].focus;
        if(this.elements[i].mousein) {
            this.elements[i].focus = true;
            if(!this.elements[i].focusp) info = this.elements[i].Focus(e);
            this.elements[i].Click(this.context,this.canvas.offsetLeft,this.canvas.offsetTop,e);
            console.log(this.cursor.i,this.cursor.j);
        }
        else {
            this.elements[i].focus = false;
            if(this.elements[i].focusp) {
                this.cursor.display = false;
                this.cursor.counter = 0;
                this.elements[i].Blur(e);
            }
        }
    }
};

/**
    * Other events.
*/
FormCanvas.prototype.onMouseDown = function (e) {
    for ( var i=this.elements.length-1; i > -1; --i ) {
        if(this.elements[i].mousein) {
            this.elements[i].MouseDown(e);
        }
    }
};

FormCanvas.prototype.onMouseUp = function (e) {
    for ( var i=this.elements.length-1; i > -1; --i ) {
        if(this.elements[i].mousein) {
            this.elements[i].MouseUp(e);
        }
    }
};

FormCanvas.prototype.KeyDown = function (e) {
    for ( var i=this.elements.length-1; i > -1; --i ) {
        if(this.elements[i].focus) {
            this.elements[i].KeyDown(e);
        }
    }
};

FormCanvas.prototype.onKeyUp = function (e) {
    for ( var i=this.elements.length-1; i > -1; --i ) {
        if(this.elements[i].focus) {
            this.elements[i].KeyUp(e);
        }
    }
};

FormCanvas.prototype.KeyPress = function (e) {
    for ( var i=this.elements.length-1; i > -1; --i ) {
        if(this.elements[i].focus) {
            this.elements[i].KeyPress(e);
        }
    }
};