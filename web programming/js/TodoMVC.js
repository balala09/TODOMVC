var total_todo = 0;
var order = 0;
var titles = [];
var start_time = [];
var end_time = [];
var place = [];
var whetherchecked = [];
var complete_num = 0;
//初始化函数（包括网页刷新后用来重新渲染页面，和一些按钮的点击事件，侧边栏滑动事件等）
window.onload = function () {
    var box = document.getElementById("test")
    var btn = document.getElementById("btn")
    var side = document.getElementById("side")
    btn.onclick = function () {
        console.log("in")
        if (box.offsetLeft == 0) {
            side.style.zIndex = "0";
            box.style['margin-left'] = -300 + "px";
            btn.style.marginLeft = 0 + "px";

        } else {
            box.style['margin-left'] = 0 + "px";
            btn.style.marginLeft = 300 + "px";
            side.style.zIndex = "20";
        }
    }
    model.init(function () {

        //网页刷新后用来重新渲染页面；
        initial("slideDeleteBox");

        //为一些按钮添加点击事件（如搜索按钮）
        var search_box = document.querySelector("#search");
        search_box.addEventListener('keyup', function (ev) {
            if (ev.keyCode != 13) return;
            var thing = search_box.value;
            if (thing == '') {
                alert('keyword cannot be empty');
                return;
            }
            search();
        })
    })
}

//刷新完成后渲染页面，主要是todo列表的生成；
function initial(div_name) {
    var data = model.data;
    if (data.complete_item == '') {
        data.complete_item = 0;
        model.set_complete();
    }
    if (data.total_todo == '') {
        data.total_todo = 0;
        model.set_total();
    }
    if (data.start_time != []) {
        var data_length = data.start_time.length;
        for (var i = 0; i < data_length; i++) {
            _title = data.titles[i];
            _starttime = data.start_time[i];
            _endtime = data.end_time[i];
            _place = data.places[i];
            _check = data.whetherchecked[i];
            produce_list(div_name,i);
            get_slide(i);
        }
        // get_slide();
    }
}


//渲染时生成列表的主函数，根据获取的
function produce_list(div_name, i) {
    var data = model.data;
    //生成一个个list的div
    var box1 = document.createElement("div");
    box1.className = "list-box";
    box1.classList.add(i);
    var todolist = document.getElementById(div_name);
    todolist.appendChild(box1);

    //滑动删除所需的div；
    var box2 = document.createElement("div");
    box2.className = "touch-box";
    box1.appendChild(box2);

    var box3 = document.createElement("div");
    box3.className = "touch"
    box2.appendChild(box3);
    
    //删除按钮
    var deletebox = document.createElement("div");
    deletebox.className = "del";
    deletebox.classList.add(i);
    deletebox.innerHTML = "Delete";
    box2.appendChild(deletebox);

    //恢复list上的完成按钮等
    var newitem = document.createElement("p");
    newitem.innerHTML = data.titles[i] + "<input type='checkbox'>";
    box3.appendChild(newitem);
    var completed = box3.getElementsByTagName("input")[0];
    completed.type = "checkbox";

    //恢复完成按钮的状态，并设置相应数据的改变；
    var ischeck=data.whetherchecked[i];
    if (ischeck == "false" || ischeck == false) {
        completed.checked = false;
    } else completed.checked = true;
    completed.className = i;
    completed.addEventListener('touchstart', function () {
        this.checked = !this.checked;
        data.whetherchecked[this.className] = this.checked;
        model.set_checked();
        complete_num++;
        data.complete_item = complete_num;
        model.set_complete();
        document.getElementById("completed").getElementsByTagName('span')[0].innerHTML = complete_num.toString();
        document.getElementById("remain").getElementsByTagName('span')[0].innerHTML = data.total_todo - data.complete_item;
    })
    //设置下拉按钮的点击事件，可以弹出todo的详情页；
    var detail_button = document.createElement("button");
    detail_button.className = i;
    box3.appendChild(detail_button);
    detail_button.addEventListener('touchstart', function () {
       
        var pop = document.createElement("div");
        pop.id = "pop" + this.className;
        document.getElementById("main").appendChild(pop);
        var id = this.className;

        //显示事件,回车可修改保存
        var show_title = document.createElement("input");
        show_title.type = "text";
        show_title.value = data.titles[id];
        show_title.className = id;
    
        //显示开始时间
        var start_label = document.createElement("label");
        start_label.innerHTML = "Start";
        var show_starttime = document.createElement("input");
        show_starttime.type = "date";
        show_starttime.value = data.start_time[id];
        show_starttime.className = id;

        //显示结束时间
        var end_label = document.createElement("label");
        end_label.innerHTML = "DDL";
        var show_endtime = document.createElement("input");
        show_endtime.type = "date";
        show_endtime.value = data.end_time[id];
        show_endtime.className = id;

        //显示地点，回车可修改保存
        var place_label = document.createElement("label");
        place_label.innerHTML = "Place:";
        var show_place = document.createElement("input");
        show_place.type = "text";
        show_place.value = data.places[id];
        show_place.className = id;
       
        //退出按钮，退出时自动保存
        var button_close = document.createElement("button");
        button_close.className = this.className;
        button_close.addEventListener("touchstart", close);

        pop.appendChild(button_close);
        pop.appendChild(show_title);
        pop.appendChild(start_label);
        pop.appendChild(show_starttime);
        pop.appendChild(end_label);
        pop.appendChild(show_endtime);
        pop.appendChild(place_label);
        pop.appendChild(show_place);
        pop.className = "pop";
    })
    //设置完成数、未完成数、总数；
    document.getElementById("all").getElementsByTagName('span')[0].innerHTML = data.total_todo;
    console.log(data.complete_item);
    document.getElementById("completed").getElementsByTagName('span')[0].innerHTML = data.complete_item;
    document.getElementById("remain").getElementsByTagName('span')[0].innerHTML = data.total_todo - data.complete_item;
}

//添加事件到list中
function add(title, starttime, endtime, _place, div_name, ischeck) {
    //判断输入是否为空
    if (title == '') {
        alert("Outline cannot be empty!");
        return;
    }
    var data = model.data;
    
    //总数加一
    total_todo++;
    data.total_todo = total_todo;
    model.set_total();
    document.getElementById("all").getElementsByTagName('span')[0].innerHTML = total_todo.toString();
    document.getElementById("remain").getElementsByTagName('span')[0].innerHTML = total_todo;

    //存储到localstorage中
    data.titles.push(title);
    data.start_time.push(starttime);
    data.end_time.push(endtime);
    data.places.push(_place);
    data.whetherchecked.push(ischeck);
    model.set_title();
    model.set_start();
    model.set_end();
    model.set_place();
    model.set_checked();

   //同上，几个滑动删除所需的box和展示用的div
    var box1 = document.createElement("div");
    box1.className = "list-box";
    box1.classList.add(total_todo - 1);
    var todolist = document.getElementById(div_name);
    todolist.appendChild(box1);

    var box2 = document.createElement("div");
    box2.className = "touch-box";
    box1.appendChild(box2);

    var box3 = document.createElement("div");
    box3.className = "touch"
    box2.appendChild(box3);

    var deletebox = document.createElement("div");
    deletebox.className = "del";
    deletebox.classList.add(total_todo - 1);
    deletebox.innerHTML = "Delete";
    box2.appendChild(deletebox);

    var newitem = document.createElement("p");
    newitem.innerHTML = title + "<input type='checkbox'>";
    box3.appendChild(newitem);

    var completed = box3.getElementsByTagName("input")[0];
    completed.type = "checkbox";
    completed.checked = ischeck;
    completed.className = total_todo - 1;

    //完成按钮的点击事件
    completed.addEventListener('touchstart', function () {
        this.checked = !this.checked;
        data.whetherchecked[this.className] = this.checked;
        model.set_checked();

        //若本来为完成，点击后变为完成，完成数加一，待完成数减一；
        if (this.checked == true) {
            complete_num++;
            data.complete_item = complete_num;
        } 
        //取消完成，点击后变为待完成，完成数减一，待完成数加一；
        else {
            complete_num--;
            data.complete_item = complete_num;
        }
        model.set_complete();
        document.getElementById("completed").getElementsByTagName('span')[0].innerHTML = complete_num.toString();
        document.getElementById("remain").getElementsByTagName('span')[0].innerHTML = data.total_todo - data.complete_item;
    })

    
    var detail_button = document.createElement("button");
    detail_button.className = total_todo - 1;
    box3.appendChild(detail_button);
    get_slide(total_todo - 1);

    detail_button.addEventListener('touchstart', function () {console.log("zhanshijihao"+this.className)

        var id = this.className;
        var pop = document.createElement("div");
        pop.id = "pop" + id;
        document.getElementById("main").appendChild(pop);

        var show_title = document.createElement("input");
        show_title.type = "text";
        show_title.value = data.titles[id];
        show_title.className = id;

        var start_label = document.createElement("label");
        start_label.innerHTML = "Start";
        var show_starttime = document.createElement("input");
        show_starttime.type = "date";
        show_starttime.value = data.start_time[id];
        show_starttime.className = id;

        var end_label = document.createElement("label");
        end_label.innerHTML = "End";
        var show_endtime = document.createElement("input");
        show_endtime.type = "date";
        show_endtime.value = data.end_time[id];
        show_endtime.className = id;

        var place_label = document.createElement("label");
        place_label.innerHTML = "Place";
        var show_place = document.createElement("input");
        show_place.type = "text";
        if (data.places == [])
            show_place.value = '';
        else
            show_place.value = data.places[id];
        show_place.className = id;

        var button_close = document.createElement("button");
        button_close.className = this.className;
        button_close.addEventListener("touchstart", close);

        pop.appendChild(button_close);
        pop.appendChild(show_title);
        pop.appendChild(start_label);
        pop.appendChild(show_starttime);
        pop.appendChild(end_label);
        pop.appendChild(show_endtime);
        pop.appendChild(place_label);
        pop.appendChild(show_place);
        pop.className = "pop";
    })
    //把输入框置为空
    document.getElementById("input_title").value="";
    document.getElementById("input_place").value ="";
}

function close() {
    var data=model.data;
    var id = this.className;
    var pop=document.getElementById("pop" + id);
    var inputs=pop.getElementsByTagName('input');
    data.titles[id]=inputs[0].value;
    data.start_time[id]=inputs[1].value;
    data.end_time[id]=inputs[2].value;
    data.places[id]=inputs[3].value;
    model.set_title();
    model.set_start();
    model.set_end();
    model.set_place();
    pop.remove();
}
function get_slide(i) {
    var obj = {
        move: 0,
        startTouchSite: 0,
        disX: 0,
        init: function(){
            var winWidth = $(window).width();
            var delWidth = $("#slideDeleteBox .del").css("width");
            var sumWidth = winWidth + parseInt(delWidth);

            $(".touch-box").css("width",sumWidth+'px');
            $(".touch").css("width",winWidth+'px');

            obj.bindEvent();
            return obj;
        },
        bindEvent: function(){
            if(!obj.isPC()) {
                    document.getElementsByClassName('touch-box')[i].addEventListener('touchstart', function (event) {
                        var e = event || window.event;
                            e.preventDefault();
                            e.stopPropagation();

                        var touchPosition = e.targetTouches[0];
                        var touch_x = touchPosition.pageX;
                        var offsetLeft = $(this).offset().left;

                        obj.move = 0;
                        obj.startTouchSite = touch_x;
                        obj.disX = touch_x - offsetLeft;

                        $(".open").each(function () {
                            if ($(this).css('left') !== "0px") {
                                $(this).animate({'left': '0'}, 300);
                            }
                        });

                        if ($(this).css('left') === '-100px') {
                            $(this).animate({'left': '0'}, 300, function () {
                                if (!$(this).is(":animated")) {
                                    var offsetLeft = $(this).offset().left;
                                    obj.disX = touch_x - offsetLeft;
                                }
                            });
                        }
                    }, {passive: false});

                    document.getElementsByClassName('touch-box')[i].addEventListener('touchmove', function (event) {
                        var e = event || window.event;
                            e.preventDefault();
                            e.stopPropagation();

                        var touchPosition = e.targetTouches[0];
                        var touch_x = touchPosition.pageX;
                        var left = $(this).css('left');
                        $('.touch-box').eq(i).stop();

                        obj.move = touch_x - obj.disX;

                        if (touch_x < obj.startTouchSite && obj.move < 0 && obj.move >= -100) {
                            $(this).css('left', obj.move + 'px');
                        } else if (touch_x > obj.startTouchSite && obj.move < 0 && obj.move >= -100) {
                            $(this).css('left', obj.move + 'px');
                        }
                    }, {passive: false});

                    document.getElementsByClassName('touch-box')[i].addEventListener('touchend', function (event) {
                        var e = event || window.event;
                            e.preventDefault();
                            e.stopPropagation();

                        if (obj.move < -50) {
                            $(this).animate({'left': '-100px'}, 300);
                            $(this).addClass('open');
                        } else {
                            $(this).animate({'left': '0'}, 300);
                            $(this).removeClass('open');
                        }
                    }, {passive: false});

                    document.getElementsByClassName('del')[i].addEventListener('touchstart', function (event) {
                        var e = event || window.event;
                            e.preventDefault();
                            e.stopPropagation();

                        var touch = e.targetTouches[0];

                        self.delTouchStartX = touch.pageX;
                        delete_todo(this.classList[1]);
                        return false;
                    }, {passive: false});
            }else{
                $(document).on("dblclick", ".touch", function () {
                    var left = $(this).parent().css('left');

                    $(".open").animate({'left': '0'}, 300, function () {
                        $(this).removeClass("open");
                    });

                    if(left === '-100px'){
                        $(this).parent().animate({'left': '0'}, 300);
                    }else{
                        $(this).parent().animate({'left': '-100px'}, 300, function(){
                            $(this).addClass('open');
                        });
                    }
                });

                $(document).on("click", ".del", function () {
                    console.log('PC删除请求');
                    return false;
                });
            }
        },
        isPC: function(){
            var userAgentInfo = navigator.userAgent;
            var agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
            var flag = true;
            for (var i = 0; i < agents.length; i++) {
                if (userAgentInfo.indexOf(agents[i]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }
    };
    window.slideDelete = new obj.init();
};

//删除某一条记录
function delete_todo(i) {
    console.log(i)
    var data = model.data;
    //获取所有的记录
    var area = document.getElementsByClassName('list-box');
    for (var j = 0; j < area.length; j++) {
        //如果这条记录是我们要找的这个序号
        if (area[j].classList.contains(i.toString())) {
            if (data.whetherchecked[j] == true || data.whetherchecked[j] == 'true') {
                data.complete_item--;
                model.set_complete();
                console.log(data.complete_item);
                document.getElementById('completed').getElementsByTagName('span')[0].innerHTML = data.complete_item;
            }
            //删除此条记录，相应的总数、完成数、待完成数也做相应改变；
           
            total_todo--;
            data.total_todo = total_todo;
            //删除这个序号存在localstorage中的数据并把这个序号后的数据全部往前挪一位
            var all_item = document.getElementsByClassName("list-box");
            for (var i = 0; i < all_item.length; i++) {
                if (i > j) {
                    all_item[i].classList.remove(i);
                    all_item[i].classList.add(i - 1);
                    all_item[i].getElementsByTagName('button')[0].classList.remove(i);
                    all_item[i].getElementsByTagName('input')[0].classList.remove(i);
                    all_item[i].getElementsByTagName('button')[0].classList.add(i - 1);
                    all_item[i].getElementsByTagName('input')[0].classList.add(i-1);
                    all_item[i].getElementsByClassName('del')[0].classList.remove(i);
                    all_item[i].getElementsByClassName('del')[0].classList.add(i-1);
                }
            }
            area[j].remove();
            for (var t = j; t < data.titles.length; t++) {
                data.titles[t] = data.titles[t + 1];
                data.start_time[t] = data.start_time[t + 1];
                data.end_time[t] = data.end_time[t + 1];
                data.places[t] = data.places[t + 1];
                data.whetherchecked[t] = data.whetherchecked[t + 1];
            }
            data.titles.pop();
            data.start_time.pop();
            data.end_time.pop();
            data.places.pop();
            data.whetherchecked.pop();
            model.set_title();
            model.set_start();
            model.set_end();
            model.set_place();
            model.set_checked();
        }
    }
    model.set_total();
    document.getElementById("all").getElementsByTagName('span')[0].innerHTML = data.total_todo.toString();
    document.getElementById("remain").getElementsByTagName('span')[0].innerHTML = data.total_todo - data.complete_item;
}

//展示完成的数据
function show_completed() {
    var data = model.data;
    //清除其他窗口
    clear_other();
    var complete_div = document.createElement("div");
    complete_div.id = "completed_pop";

    //获取所有list的checkbox的状态，若完成则加入显示列表中
    document.getElementsByTagName("section")[0].appendChild(complete_div);
    var parents = document.getElementById("slideDeleteBox").getElementsByClassName("list-box");
    for (var i = 0; i < parents.length; i++) {
        var input = parents[i].getElementsByClassName("touch-box")[0].getElementsByClassName("touch")[0].getElementsByTagName("input")[0].checked;
        if (input) {
            // _title = data.titles[i];
            // _starttime = data.start_time[i];
            // _endtime = data.end_time[i];
            // _place = data.places[i];
            produce_list("completed_pop", i);
            get_slide(i);
        }
    }
}

//展示未完成的数据，原理同上
function show_remain() {
    var data = model.data;
    clear_other();
    var remain_div = document.createElement("div");
    remain_div.id = "remain_pop";
    document.getElementsByTagName("section")[0].appendChild(remain_div);
    var parents = document.getElementById("slideDeleteBox").getElementsByClassName('list-box');
    for (var i = 0; i < parents.length; i++) {
        var input = parents[i].getElementsByClassName("touch-box")[0].getElementsByClassName("touch")[0].getElementsByTagName("input")[0].checked;
        if (!input) {
            // _title = data.titles[i];
            // _starttime = data.start_time[i];
            // _endtime = data.end_time[i];
            // _place = data.places[i];
            // console.log(i);
            produce_list("remain_pop",i);
            get_slide(i);
        }
    }
}

//展示主页面
function show_all() {
    clear_other();
    document.getElementById("slideDeleteBox").style.display = "block";
}

//搜索关键字
function search() {
    var keyword = document.getElementById("search").value;
    var results = [];
//在事件摘要、时间、地点中搜索此关键字
    var data = model.data;
    for (var i = 0; i < data.titles.length; i++) {
        //是否包含这个子串
        if (data.titles[i].indexOf(keyword) >= 0) {
            results.push(i);
            continue;
        }
        if (data.start_time[i].indexOf(keyword) >= 0) {
            results.push(i);
            continue;
        }
        if (data.end_time[i].indexOf(keyword) >= 0) {
            results.push(i);
            continue;
        }
        if (data.places[i].indexOf(keyword) >= 0) {
            results.push(i);
            continue;
        }
    }
    clear_other();
    var result_div = document.createElement("div");
    result_div.id = "result_pop";
    document.getElementsByTagName("section")[0].appendChild(result_div);
    for (var i = 0; i < results.length; i++) {
        var index = results[i];
        produce_list("result_pop", index);
        get_slide(index);
    }
}

//展示分析报告；
function show_analysis() {
    var days = 0;
    var got = 0;
    var data = model.data;
    //获取今天和一周前的日期
    today=new Date();
    beginDate = new Date();
    beginDate.setDate(beginDate.getDate() - 7);
    if (data.end_time != []) {
        for (var i = 0; i < data.end_time.length; i++) {
            //若此任务的截止时间在上周的时间内，且完成，则记录为完成；
            enddate = data.end_time[i];
            dateStr2 = enddate.split("-");
            var _date = new Date(dateStr2[0], dateStr2[1] - 1, dateStr2[2]);
            if (_date >= beginDate && _date <= today) {
                days++;
                if (data.whetherchecked[i] == true || data.whetherchecked[i] == 'true') {
                    got++;
                }
            }
        }
    }
    clear_other();
    var future_div = document.createElement("div");
    future_div.id = "future_pop";
    document.getElementById("main").appendChild(future_div);
    var head1 = document.createElement('p');
    head1.innerHTML = "In the past week..."
    var past_events = document.createElement("p");
    past_events.className = "report"
    past_events.innerHTML = "You had <span>" + days + "</span> items.";
    var past_dos = document.createElement("p");
    past_events.className = "report";
    past_dos.innerHTML = "You have completed <span>" + got + "</span> of them.<br><hr><br>";
    var head2 = document.createElement('p');
    head2.innerHTML = "In the next week..."
    future_div.appendChild(head1);
    future_div.appendChild(past_events);
    future_div.appendChild(past_dos);
    future_div.appendChild(head2);
    show_future();
}

//筛选出未来的工作
function show_future() {
    var dd = new Date();
    //获取7天后的日期 
    dd.setDate(dd.getDate() + 7); 
    var data = model.data;
    if (data.end_time != []) {
        //若截止日期在未来的一周内且未完成，则记录下来；
        for (var i = 0; i < data.end_time.length; i++) {
            enddate = data.end_time[i];
            dateStr2 = enddate.split("-");
            var date2 = new Date(dateStr2[0], dateStr2[1] - 1, dateStr2[2]);
            if (date2 < dd && date2 > new Date()) {
                if (data.whetherchecked[i] == "false" || data.whetherchecked[i] == false) {
                    produce_list('future_pop',i);
                    get_slide(i);
                }
            }
        }
    }
}

//全部完成
function complete_all() {
    var checkbox = document.getElementsByTagName("input");
    var num = 0;
    //获取所有的list，把checkbox的状态改为true，且更新存储的数据；
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].type == "checkbox") {
            checkbox[i].checked = true;
            model.data.whetherchecked[num] = 'true';
            model.data.complete_item = model.data.total_todo;
            model.set_checked();
            model.set_complete();
            num++;
        }
    }
    var data=model.data;
    document.getElementById("completed").getElementsByTagName('span')[0].innerHTML = model.data.complete_item.toString();
    document.getElementById("remain").getElementsByTagName('span')[0].innerHTML = data.total_todo - data.complete_item;
}

//全部取消完成
function uncomplete_all() {
    var checkbox = document.getElementsByTagName("input");
    var num = 0;
     //获取所有的list，把checkbox的状态改为false，且更新存储的数据；
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].type == "checkbox") {
            checkbox[i].checked = false;
            model.data.whetherchecked[num] = 'false';
            model.data.complete_item = model.data.total_todo;
            model.set_checked();
            model.set_complete();
            num++;
        }
    }
    var data=model.data;
    document.getElementById("completed").getElementsByTagName('span')[0].innerHTML = 0;
    document.getElementById("remain").getElementsByTagName('span')[0].innerHTML = data.total_todo;
}

//删除已完成
function delete_complete() {
    var checkbox = document.getElementById('slideDeleteBox').getElementsByTagName("input");
    console.log(checkbox.length)
    // var num = 0;
     //获取所有的list，若状态为完成，调用删除函数删除并更新存储的数据；
    for (var i = 0; i < checkbox.length; i++) {
        console.log(checkbox[i])
        if (checkbox[i].type == "checkbox") {
            if (checkbox[i].checked == true||checkbox[i].checked == 'true') {
                console.log(checkbox[i]);
                delete_todo(i)
            }
            // num++;
        }
    }
}

//清除可能存在的窗口
function clear_other() {
    document.getElementById("slideDeleteBox").style.display = "none";
    if (document.getElementById("completed_pop") != null)
        document.getElementById("completed_pop").remove();
    if (document.getElementById("remain_pop") != null)
        document.getElementById("remain_pop").remove();
    if (document.getElementById("result_pop") != null)
        document.getElementById("result_pop").remove();
    if (document.getElementById("future_pop") != null)
        document.getElementById("future_pop").remove();
}