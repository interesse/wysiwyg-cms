function CMS(){
}

CMS.mouse_down= function(event){
  var pageX= event.pageX;
  var pageY= event.pageY;
  var box= $("<div></div>").addClass("box");
  pageX= pageX-(pageX%40);
  pageY= pageY-(pageY%10);
  startX= pageX;
  startY= pageY;
  box.data("startX",startX);
  box.data("startY",startY);
  box.css("left",pageX);
  box.css("top",pageY);
  $("#overlay").before(box);
  $("#overlay").data("current_box",box);
  $("#overlay").mousemove(CMS.mouse_move);
  $("#overlay").mouseup(CMS.mouse_up);
}
CMS.mouse_move= function(event){
  var box= $("#overlay").data("current_box");
  startX= box.data("startX");
  startY= box.data("startY");
  var width= event.pageX-startX;
  var height= event.pageY-startY;
  width= width-(width%40)-10;
  height= height-(height%10)+10;
  box.width(width);
  box.height(height);
//  console.log(box.offset());
}
CMS.mouse_up= function(event){
  var box= $("#overlay").data("current_box");
  CMS.mouse_move(event);
  box.css("min-height",box.height());
//
//  $("#overlay").unbind("mousedown");
  $("#overlay").unbind("mousemove");
  $("#overlay").unbind("mouseup");
  $("#overlay").data("current_box",null);
//  box.unbind("mousedown");
  CMS.add_controls(box);
}
CMS.add_controls= function(box){
  var controls= $("<div></div>").addClass("controls");
  CMS.add_control(controls, "Var", CMS.variable_height);
  CMS.add_control(controls, "Text", CMS.add_text);
  CMS.add_control(controls, "Cols", CMS.to_columns);
  box.append(controls);
}
CMS.add_control= function(controls, label, func){
  var control= $("<div>"+label+"</div>").addClass("control");
  control.click(func);
  controls.append(control);
}
CMS.variable_height= function(){
  var box= $(this).parents(".box, .area");
  box.toggleClass("variable_height");
}
CMS.add_text= function(){
  var box= $(this).parents(".box, .area");
  box.append("While most of the new features in the jQuery UI package are common across most AJAX frameworks and toolkits, the new Selectables stands out as a unique and potentially quite useful interface element.");
}
CMS.calculate_left_margin= function(box){
  var rect= box[0].getBoundingClientRect();
  box.left= rect.left;
  box.top= rect.top;
  box.bottom= rect.bottom;
  box.right= rect.right;
  var diff_left=0;
  console.log(box);
  $(".area").each(function(){
    var other= $(this);
    var rect= this.getBoundingClientRect();
    other.left= rect.left;
    other.top= rect.top;
    other.bottom= rect.bottom;
    other.right= rect.right;
    console.log("top"+box.top+","+other.top);
    console.log("bottom"+box.bottom+","+other.bottom);
    console.log("left"+box.left+","+other.left);
    console.log("right"+box.right+","+other.right);
    if(!(box[0]==other[0]) && other.right>diff_left ){
      diff_left= other.right;
    }
  });
  console.log(diff_left);
  return box.left-diff_left;
}
CMS.to_columns= function(){
  var box= $(this).parents(".box");
  box.addClass("area");
  var left= box.offset().left;
  var top= box.offset().top;
  width= box.width();
  height= box.height();
  var left_margin= CMS.calculate_left_margin(box);
  box.attr("style",null);
  box.css("margin-left",left_margin);
  box.css("margin-top",top);
  box.width(width);
  if(! box.hasClass("variable")){
    box.height(height);
  }
  box.removeClass("box");
}
jQuery(document).ready(function(){
  $("#overlay").mousedown(function(event){
    CMS.mouse_down(event);
  });
});

