var iWriter_controller = new Controller();
var event_type = 'click';
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    event_type = 'touchend';
}

var jsonData = "";
var tell_more = "";
var tbl_name = "iwriter_windows";
iWriter_controller.preLoad();
function Controller() {
    //Properties
    this.project_xml_data = new Object();
    this.project_count = 0;
    this.load_count = 0;
    this.current_key;
    this.para_ids = new Array();
    this.event_type = 'click';
    this.config_msg;
    this.xml_img_path = 'images/mitr/xml/';
    this.project_short_name = "";
    this.current_tool = '';
    this.show_popup = false;
    this.current_pro_name = '';
    this.lang = "";
    this.json = "";
    var _this = this;

    //functions

    this.preLoad = function () {


        $.ajax({// to get project list
            type: "GET",
            url: "data.json",
            dataType: "json",
            success: function (json) {
                _this.json = json;
                _this.init();
            },
            error: function () {
                alert("An error occurred while processing XML file.");
            }
        });



    }
    this.init = function (load_data_arg) {
        //load_data_arg = yes = load all the xml in init else when required

        if (localStorage.getItem("lang") !== null)
        {

            _this.lang = localStorage.getItem("lang");


        } else {
            _this.lang = "cs";
        }
        //_this.lang = localStorage.lang;
        tell_more = _this.json["tell"][_this.lang];
        jsonData = _this.json[_this.lang];
        $('title').html(jsonData["title"]);
        $(".language").find("option[value=" + _this.lang + "]").attr('selected', true);

        var project_count = 0;






        $('.fn_left h2').html(jsonData["model"]);
        $('.fn_rigth h2').html(jsonData["writer"]);
        $('.save_p_btn_txt').html(jsonData["my_saved_writing"]);


        $('.model_want_to_see').html(jsonData["model_want_to_see"]);

        $('.top_model_menu_text').html(jsonData["model"]);
        $('.current_tool').html(jsonData["writer"]);
        $('.help_btn a').html(jsonData["help"]);
        $('li.help_btn').html(jsonData["help"]);
        $('.hlp_btn').html(jsonData["help"]);
        $('.drp_home_clk').html(jsonData["home"]);
        $('.ok_lang').html(jsonData["ok"]);
        $('.can_btn').html(jsonData["cancel"]);
        $('.models_page_menu_text').html(jsonData["model"]);
        $('.load_pro_in').html(jsonData["load"]);
        $('.save_pro_in').html(jsonData["save"]);
        $('.saveas_pro_in').html(jsonData["save_as"]);
        $('.export_doc').html(jsonData["export"]);
        $('.name_your_project').html(jsonData["name_your_project"]);
        $('.pop_msg_d').html(jsonData["project_has_been_created"]);

        $('#show_structre').html(jsonData["show_structure"]);
        $('#show_notes').html(jsonData["show_notes"]);
        $('#show_content').html(jsonData["show_content"]);
        $('#show_all').html(jsonData["show_all"]);





        this.load_data = load_data_arg;
        $.ajax({// to get project list
            type: "GET",
            url: "xml/" + _this.lang + "/frameworks.xml",
            dataType: "xml",
            success: function (xml) {
                $(xml).find('framework').each(function () {
                    var project_name = $(this).attr('name');
                    var short_name = $(this).attr('shortname');
                    var file_name = $(this).attr('code') + '.xml';
                    var object_name = $(this).attr('code');
                    _this.project_xml_data[project_count] = {'project_name': project_name, 'file_name': file_name, 'object_name': object_name, 'short_name': short_name};
                    project_count++;
                    _this.project_count = project_count;
                    if (Number($(xml).find('framework').length) === _this.project_count) {
                        _this.loadFramework();
                    }
                });
            },
            error: function () {
                alert("An error occurred while processing XML file.");
            }
        });
        $.ajax({// to get config
            type: "GET",
            url: "xml/" + _this.lang + "/config.xml",
            dataType: "xml",
            success: function (xml) {
                _this.config_msg = xml;
            },
            error: function () {
                alert("An error occurred while processing XML file.");
            }
        });
    };
    this.loadFramework = function () {
        $.ajax({
            type: "GET",
            url: "xml/" + _this.lang + "/frameworks.xml",
            dataType: "xml",
            success: function (xml) {
                $(xml).find('framework').each(function () {
                    for (var key in _this.project_xml_data) {
                        if (_this.project_xml_data[key]['object_name'] == $(this).attr('code')) {
                            _this.project_xml_data[key]['framework_model'] = $(this).attr('model');
                            _this.project_xml_data[key]['framework_summery'] = $(this).attr('summary');
                            _this.project_xml_data[key]['framework_enabled'] = $(this).attr('enabled');
                        }
                    }
                });
                _this.loadXML();
            },
            error: function () {
                alert("An error occurred while processing XML file.");
            }
        });
    };
    this.loadXML = function () {
        if (_this.load_count < _this.project_count) {
            $.ajax({
                type: "GET",
                url: "xml/" + _this.lang + "/" + _this.project_xml_data[_this.load_count]['file_name'],
                dataType: "xml",
                success: function (xml) {
                    _this.project_xml_data[_this.load_count]['xml_data'] = xml;
                    _this.load_count++;
                    _this.loadXML();
                },
                error: function () {
                    alert("An error occurred while processing XML file.");
                }
            });
            //if ((_this.project_count - _this.load_count) === 1) {
            //this.leftPanelModel('li', '.second_page_body_left ul');
            //}
        }
    };
    this.leftPanelModel = function (element, wrapper) {

        _this.modelInit();
        var project_html = '';
        for (var key in _this.project_xml_data) {
            if (_this.project_xml_data[key]['framework_model'] === 'y' && _this.project_xml_data[key]['framework_enabled'] === 'true') {
                project_html = project_html + '<' + element + ' data-key="' + key + '"><div class="li_inner"><span class="sp_left" data-key="' + key + '">' + _this.project_xml_data[key]['project_name'] + '</span><span class="info_ic"></span></div><div class="info_text">' + _this.project_xml_data[key]['framework_summery'] + '</div>' + '</' + element + '>';
            } else {
                //project_html = project_html + '<' + element + ' data-key="' + key + '"><div style="opacity: 0.3; cursor: default;"class="li_inner_dis"><span class="sp_left_dis" data-key="' + key + '">' + _this.project_xml_data[key]['project_name'] + '</span><span class="info_ic_dis"></span></div><div class="info_text">' + _this.project_xml_data[key]['framework_summery'] + '</div>' + '</' + element + '>';
            }
        }
        $('.left_menu').hide();
        $('.second_page_body_left').css('left', '0');
        $('.second_page_body_right').empty();
        $(wrapper).empty().append(project_html);
        $('.model_want_to_see').html(jsonData["model_want_to_see"]);
        if (Number($(window).width()) <= 480) {
            $('.second_page_top h1').text(jsonData["choose_a_model"]);
        }
        $('.top_model_menu_text,.models_page_menu_text').html(jsonData['model']);
        $(".info_ic").each(function (index, element) {

            $(this).attr('data-show', 'hide');
            $(this).bind(event_type, function (e) {
                if ($(window).width() <= 768) {
                    //$(".info_text").hide("blind");
                    //$(this).parent().next().show("blind");
                    $(".info_text").slideUp();
                    $(".info_ic").css('background-image', 'url("images/mitr/oxford/info_01.png")');
                    if ($(this).attr('data-show') == 'hide') {
                        $(this).parent().next().slideDown();
                        $(this).attr('data-show', 'show');
                        $(this).css('background-image', 'url("images/mitr/info_btn_active.png")');
                    } else {
                        $(".info_text").slideUp();
                        $(this).attr('data-show', 'hide');
                        $(this).css('background-image', 'url("images/mitr/oxford/info_01.png")');
                    }
                }
            });
            $(this).mouseover(function (e) {
                if ($(window).width() > 768) {
                    var pos = $(this).position();
                    $('.arrow_box').html($(this).parents('.li_inner').next().html());
                    $('.arrow_wrp').css('top', pos.top - ($('.arrow_wrp').height() / 2) + 16);
                    $('.arrow_wrp').css('left', pos.left + 36);
                    $('.arrow_wrp').show();
                    $(this).css('background-image', 'url("images/mitr/info_btn_active.png")');
                }
            }).mouseout(function (e) {
                if ($(window).width() > 768) {
                    $('.arrow_wrp').hide();
                    $(this).css('background-image', 'url("images/mitr/oxford/info_01.png")');
                }
            });
        });
        $(wrapper + ' .sp_left').off().on(event_type, function (e) {

            _this.current_pro_name = '';
            _this.createModel($(this).html(), $(this).attr('data-key'));
        });
    };
    this.modelInit = function () {
        //model init
        _this.current_tool = 'model';
        $('.inner_wrapper').css('overflow', 'hidden');
        $('.current_tool').text(jsonData["writer"]);
        $('.tool_down_arrow').hide();
        _this.reset_drop();
        $('.current_tool').on(event_type, function (e) {

            if ($('.second_page').is(':visible')) {
                $('.fn_rigth').trigger(event_type);
            } else {
                _this.writerInit();
                if (_this.current_pro_name == '') {
                    _this.create_project(_this.current_key, 'create', '');
                } else {

                    _this.create_project(_this.current_key, 'save', _this.current_pro_name);
                }

            }
        });
        $('.iwriter_t').hide();
        console.log("its here");
        $('.search_title p:first-child').text(jsonData["choose_what_to_show"]);
        $('.search_title p:last-child').text(jsonData['explore_the_model']);
        $('.top_model_menu_text,.models_page_menu_text').html(jsonData['model']);
        $('.white_content').hide();
        //end model init
    };
    this.createModel = function (m_name, m_key) {
        _this.reset_drop();
        //e.preventDefault();
        _this.project_short_name = '';
        $('.common_page').hide();
        $('.info_text').hide();
        $('.models_page').show();
        $('.left_menu').show();
        $('.models_page_body_left').css('left', 0);
        if ($(window).width() <= 480) {
            var left_pos = $('.models_page_body_left').position();
            if (Number(left_pos.left) == 0) {
                //$('.models_page_body').css('overflow', 'hidden');
            }
        }

        $('.str_common').each(function () {
            $(this).children('.tick_mark').removeClass('_selected');
        });
        $('.models_page_left_panel h1').html(m_name);
        $('.models_page_body .left_wrapper').empty().html('<div class="steps_title"><p>' + jsonData["guided_tour"] + '</p><p>' + jsonData["stepbystep"] + '</p></div><ul class="medels_steps"></ul>');
        $('.models_page_body_left .medels_steps').empty();
        $('.models_header').empty();
        $('.models_content').empty();
        var guided_html = '';
        var parent = this;
        _this.current_key = m_key;
        //check for filter
        var notes_status = false;
        var content_status = false;
        $('.str_common').show();
        _this.project_short_name = _this.project_xml_data[_this.current_key]['short_name'];
        if ($(window).width() <= 768) {
            if (_this.project_short_name != '') {
                $('.models_page_left_panel h1').html(_this.project_short_name);
            }
        }

        $(_this.project_xml_data[_this.current_key]['xml_data']).find('paragraph').each(function () {
            $(this).find('notes').each(function () {
                if ($(this).text().trim() != '') {
                    notes_status = true;
                }
            });
            $(this).find('content').each(function () {
                if ($(this).text().trim() != '') {
                    content_status = true;
                }
            });
        });
        if (!notes_status) {
            $('.show_notes').hide();
        }
        if (!content_status) {
            $('.show_content').hide();
        }
		// console.log($('.models_header').height());
		// $('.models_content').css("height","calc(100%-"+$('.models_header').height()+"px)");
        //end check for filter

        $(_this.project_xml_data[_this.current_key]['xml_data']).find('step').each(function () {
            guided_html = guided_html + '<li data-key="' + _this.current_key + '" data-para_ids="' + $(this).attr('para_ids') + '"><span data-key="' + _this.current_key + '" data-para_ids="' + $(this).attr('para_ids') + '">' + $(this).attr('label') + '</span></li>';
        });
        $('.models_page_body_left .medels_steps').append(guided_html);
        $('.models_page_body_left .medels_steps li').on(event_type, function () {
            _this.reset_drop();
            $('.str_common').each(function () {
                $(this).children('.tick_mark').removeClass('_selected');
            });
            $('.medels_steps li').removeAttr('style');
            $('.models_page_body_left .medels_steps li').css('background-color', 'rgba(0, 0, 0, 0)');
            $(this).css('background-color', '#00123c').css('color', '#FFFFFF');
            var left_pos = $('.models_page_body_left').position();
            if (Number(left_pos.left) == 0) {
                if ($(window).width() <= 480) {
                    $('.models_page_body_left').animate({'left': '-100%'});
                    $('.left_menu').css('background-position', '0px 0px');
                } else {
                    $('.models_page_body_left').animate({'left': '-100%'});
                    $('.left_menu').css('background-position', '0px 0px');
                }
            }


            var parent_0 = this;
            var top_para = new Array(); //It contains header info.
            var top_para_content = '';
            var para_ids = new Array(); //It contains para ids for body info.
            var body_content = '';

            $('.models_header').empty();
            $('.models_content').empty();
            if ($(this).attr('data-para_ids') === 'undefined') {
                $(_this.project_xml_data[_this.current_key]['xml_data']).find('step').each(function () {
                    if ($(this).attr('label') == $(parent_0).children('span').text()) {
                        $(this).children().find('para').each(function (index) {
                            top_para[index] = $(this).text();
                            top_para_content = top_para_content + '<p>' + $(this).text() + '</p>';
                        });
                        $('.models_header').html(top_para_content);
                    }
                });
            } else {
                para_ids = $(parent_0).attr('data-para_ids').toString().split(',');
                for (var i = 0; i < para_ids.length; i++) {
                    para_ids[i] = para_ids[i].split('_');
                    para_ids[i] = para_ids[i][para_ids[i].length - 1];
                    para_ids[i] = para_ids[i].trim();
                    para_ids[i] = parseInt(para_ids[i]);
                }

                para_ids.sort(function (a, b) {
                    return a - b
                });
                var colors = ["#E8BCC1", "#C5DBF4", "#FFF7B4", "#B6CD72", "#F2D4A6", "#DBDED8"];
                var colors_cnt = 0;
                $(_this.project_xml_data[_this.current_key]['xml_data']).find('step').each(function () {
                    if ($(this).attr('label') == $(parent_0).children('span').text()) {
                        $(this).children().find('para').each(function (index) {
                            top_para[index] = $(this).text();
                            top_para_content = top_para_content + '<p>' + '<span class="check_text">' +$(this).text() + '</span>';
                            if ($(this).attr('showme')) {
                                //top_para_content = top_para_content + '<div data-showme="' + $(this).attr('showme') + '"class="show_me_btn"></div>';
                                top_para_content = top_para_content + '<input class="show_me_btn" data-color="' + colors[colors_cnt] + '" data-showme="' + $(this).attr('showme') + '" type="checkbox" name="showme">';
                                colors_cnt++;
                            }
                            top_para_content = top_para_content + '</p>';
                        });
                        $('.models_header').html(top_para_content);
                    }
                });
				var tempHeight = ($('.models_page_body_right').height() - $('.models_page_body_right .models_header').height() - 10);
                $(_this.project_xml_data[_this.current_key]['xml_data']).find('paragraph').each(function () {

                    var tag_status = false;
                    var xml_img = '';
                    if ($(this).find('content').length != 0 || $(this).find('notes').length != 0 || $(this).find('name').length != 0 || $(this).find('desc').length != 0) {

                        var temp_con_n = 0;
                        var temp_notes_n = 0;
                        var temp_name_n = 0;
                        var temp_desc_n = 0;
                        if (typeof ($(this).children('content').attr('eid')) != 'undefined') {
                            temp_con_n = $(this).children('content').attr('eid').split('_');
                            if (typeof ($(this).children('content').attr('image')) != 'undefined') {
                                xml_img = '<div class="xml_img_wrp"><img src="' + _this.xml_img_path + '/' + $(this).children('content').attr('image') + '"/></div>';
                            }
                        }
                        if (typeof ($(this).children('notes').attr('eid')) != 'undefined') {
                            temp_notes_n = $(this).children('notes').attr('eid').split('_');
                        }
                        if (typeof ($(this).children('name').attr('eid')) != 'undefined') {
                            temp_name_n = $(this).children('name').attr('eid').split('_');
                        }
                        if (typeof ($(this).children('desc').attr('eid')) != 'undefined') {
                            temp_desc_n = $(this).children('desc').attr('eid').split('_');
                        }


                        if (para_ids.indexOf(parseInt(temp_con_n[temp_con_n.length - 1])) != (-1)) {
                            tag_status = true;
                        }
                        if (para_ids.indexOf(parseInt(temp_notes_n[temp_notes_n.length - 1])) != (-1)) {
                            tag_status = true;
                        }
                        if (para_ids.indexOf(parseInt(temp_name_n[temp_name_n.length - 1])) != (-1)) {
                            tag_status = true;
                        }
                        if (para_ids.indexOf(parseInt(temp_desc_n[temp_desc_n.length - 1])) != (-1)) {
                            tag_status = true;
                        }
                    }

                    if (tag_status) {
                        body_content += '<div class="cont_wrp_box">';
                    }
                    //for (var i = 0; i < para_ids.length; i++) {

                    var content_html_temp = '';
                    var xmlText = new XMLSerializer();
                    if ($(this).find('content').length != 0) {
                        if ($(this).find('content').children('para').length == 0) {
                            content_html_temp += $(this).find('content').text();
                        } else {
                            for (var m = 0; m < this.getElementsByTagName("content")[0].childNodes.length; m++)
                            {
                                if (this.getElementsByTagName("content")[0].childNodes[m].nodeName == 'para') {
                                    content_html_temp += xmlText.serializeToString(this.getElementsByTagName("content")[0].childNodes[m]);
                                    //console.log(xmlText.serializeToString(this.getElementsByTagName("content")[0].childNodes[m]));
                                }
                            }
                        }
                    }

                    var notes_html_temp = '';
                    if ($(this).find('notes').length != 0) {
                        if ($(this).find('notes').children('para').length == 0) {
                            notes_html_temp += $(this).find('notes').text();
                        } else {
                            for (var m = 0; m < this.getElementsByTagName("notes")[0].childNodes.length; m++)
                            {
                                if (this.getElementsByTagName("notes")[0].childNodes[m].nodeName == 'para') {
                                    notes_html_temp += xmlText.serializeToString(this.getElementsByTagName("notes")[0].childNodes[m]);
                                    //console.log(xmlText.serializeToString(this.getElementsByTagName("content")[0].childNodes[m]));
                                }
                            }
                        }
                    }

                    if ($(this).find('name').length != 0 && typeof ($(this).children('name').attr('eid')) != 'undefined') {
                        var name_node = $(this).children('name').attr('eid').split('_');
                        if (para_ids.indexOf(parseInt(name_node[name_node.length - 1])) != (-1)) {
                            body_content += '<div class="content_box"><div class="sturcture_content" style="text-align:' + $(this).attr('align') + '">';
                            body_content += '<p>' + $(this).children('name').text() + '</p>';
                            if ($(this).find('desc').length == 0 && typeof ($(this).children('desc').attr('eid')) == 'undefined') {
                                body_content += '</div></div>';
                            } else {
                                if (typeof ($(this).children('desc').attr('eid')) != 'undefined') {
                                    var _para_id = $(this).find('desc').attr('eid').split('_');
                                    if (para_ids.indexOf(parseInt(_para_id[_para_id.length - 1])) == (-1)) {
                                        body_content += '</div></div>';
                                    }
                                } else {
                                    body_content += '</div></div>';
                                }
                            }
                        }
                    }

                    if ($(this).find('desc').length != 0 && typeof ($(this).children('desc').attr('eid')) != 'undefined') {
                        var desc_node = $(this).children('desc').attr('eid').split('_');
                        if (para_ids.indexOf(parseInt(desc_node[desc_node.length - 1])) != (-1)) {

                            if ($(this).find('name').length == 0 && typeof ($(this).children('name').attr('eid')) == 'undefined') {
                                body_content += '<div class="content_box"><div class="sturcture_content" style="text-align:' + $(this).attr('align') + '">';
                            } else {
                                var _para_id = $(this).children('name').attr('eid').split('_');
                                if (para_ids.indexOf(parseInt(_para_id[_para_id.length - 1])) == (-1)) {
                                    body_content += '<div class="content_box"><div class="sturcture_content" style="text-align:' + $(this).attr('align') + '">';
                                }
                            }
                            body_content += '<p>' + $(this).find('desc').text() + '</p>';
                            body_content += '</div></div>';
                        }
                    }

                    if ($(this).find('notes').length != 0 && typeof ($(this).children('notes').attr('eid')) != 'undefined') {
                        var notes_node = $(this).children('notes').attr('eid').split('_');
                        if (para_ids.indexOf(parseInt(notes_node[notes_node.length - 1])) != (-1)) {
                            body_content += '<div class="content_box"><div class="notes_content italic_style" style="text-align:' + $(this).attr('align') + '">';
                            body_content += notes_html_temp;
                            body_content += '</div></div>';
                        }
                    }

                    if ($(this).find('content').length != 0 && typeof ($(this).children('content').attr('eid')) != 'undefined') {
                        var content_node = $(this).children('content').attr('eid').split('_');
                        if (para_ids.indexOf(parseInt(content_node[content_node.length - 1])) != (-1)) {
                            body_content += xml_img;
                            body_content += '<div class="content_box"><div class="content_contents" style="text-align:' + $(this).attr('align') + '">';
                            body_content += content_html_temp;
                            body_content += '</div></div>';
                        }
                    }
                    if (tag_status) {
                        body_content += '</div>';
                    }
                    //}
                });
                body_content = body_content.toString();
                body_content = body_content.replace(/<para/g, " <p");
                body_content = body_content.replace(/<useful/g, " <span");
                body_content = body_content.replace(/<extra_info/g, " <span");
                body_content = body_content.replace(/<\/para/g, " </p");
                body_content = body_content.replace(/<\/useful/g, "</span");
                body_content = body_content.replace(/<\/extra_info/g, "</span");
                body_content = body_content.replace(/  /g, " ");
                body_content = body_content.replace(/ ,/g, ",");
                body_content = body_content.replace(/ <\/span>,/g, "</span>,");
                body_content = body_content.replace(/\s<\/span>\./g, "</span>.");
                body_content = body_content.replace(/ <\/span> /g, " </span>");
                body_content = body_content.replace(/<\/span>\.\./g, "</span>.");
                body_content = body_content.replace(/\' /g, "'");
                $('.models_content').html(body_content);
				console.log(111);
                $('.models_content').css('height', tempHeight);
                $('.models_content').css('overflow-y', 'auto');
                _this.db_clk();
                $('.show_me_btn').on('change', function (e) {
                    _this.reset_drop();
                    //$('.content_box span').removeAttr('class');
                    var show_ids = $(this).attr('data-showme').toString().split(',');
                    var color_code = $(this).attr('data-color');
                    if (this.checked) {
						$(this).parent().find('.check_text').css("background-color",color_code);
                        for (var i = 0; i < show_ids.length; i++) {
                            show_ids[i] = show_ids[i].split('_');
                            show_ids[i] = show_ids[i][show_ids[i].length - 1];
                            $('.content_box span').each(function () {
                                var con_id = $(this).attr('eid').split('_');
                                if (con_id[con_id.length - 1] == show_ids[i]) {
                                    $(this).addClass('highlight_txt');
                                    $(this).css('background-color', color_code);
                                }
                            });
                        }
                    } else {
						$(this).parent().find('.check_text').removeAttr('style');
                        for (var i = 0; i < show_ids.length; i++) {
                            show_ids[i] = show_ids[i].split('_');
                            show_ids[i] = show_ids[i][show_ids[i].length - 1];
                            $('.content_box span').each(function () {
                                var con_id = $(this).attr('eid').split('_');
                                if (con_id[con_id.length - 1] == show_ids[i]) {
                                    $(this).removeClass('highlight_txt');
                                    $(this).removeAttr('style');
                                }
                            });
                        }
                    }
                });
            }
        });
        _this.para_ids = new Array();
        $(_this.project_xml_data[_this.current_key]['xml_data']).find('step').each(function (element, index) {
            if ($(this).attr('para_ids')) {
                var temp_array = $(this).attr('para_ids').split(',');
                for (var i = 0; i < temp_array.length; i++) {
                    _this.para_ids.push(temp_array[i]);
                }
            }
        });
        for (var i = 0; i < _this.para_ids.length; i++) {
            _this.para_ids[i] = _this.para_ids[i].split('_');
            _this.para_ids[i] = _this.para_ids[i][_this.para_ids[i].length - 1];
            _this.para_ids[i] = _this.para_ids[i].trim();
        }
        //$('.show_all').children('.tick_mark').addClass('_selected');
        $('.str_common').off(event_type).on(event_type, function () {

            $('.medels_steps li').removeAttr('style');
            _this.reset_drop();
            if ($(this).hasClass('show_all')) {
                if ($(this).children('.tick_mark').hasClass('_selected')) {
                    $('.str_common').each(function () {
                        $(this).children('.tick_mark').removeClass('_selected');
                    });
                } else {
                    $('.str_common').each(function () {
                        $(this).children('.tick_mark').addClass('_selected');
                    });
                }
            } else {

                $('.show_structre:hidden').children('.tick_mark').addClass('_selected');
                $('.show_notes:hidden').children('.tick_mark').addClass('_selected');
                $('.show_content:hidden').children('.tick_mark').addClass('_selected');
                $('.show_all').children('.tick_mark').removeClass('_selected');
                if ($(this).children('.tick_mark').hasClass('_selected')) {
                    $(this).children('.tick_mark').removeClass('_selected');
                } else {
                    $(this).children('.tick_mark').addClass('_selected');
                }

                if ($('.show_structre').children('.tick_mark').hasClass('_selected') && $('.show_notes').children('.tick_mark').hasClass('_selected') && $('.show_content').children('.tick_mark').hasClass('_selected')) {
                    $('.show_all').children('.tick_mark').addClass('_selected');
                }
            }

            $('.models_header').empty();
            $('.models_content').empty();
            var content_data = '';
            $(_this.project_xml_data[_this.current_key]['xml_data']).find('paragraph').each(function () {


                var tag_status = false;
                var xml_img = '';
                if ($(this).find('content').length != 0 || $(this).find('notes').length != 0 || $(this).find('name').length != 0 || $(this).find('desc').length != 0) {
                    tag_status = true;
                }

                if (tag_status) {
                    content_data += '<div class="cont_wrp_box">';
                }


                var content_html_temp = '';
                var xmlText = new XMLSerializer();
                if ($(this).find('content').length != 0) {

                    if (typeof ($(this).children('content').attr('image')) != 'undefined') {
                        xml_img = '<div class="xml_img_wrp"><img src="' + _this.xml_img_path + '/' + $(this).children('content').attr('image') + '"/></div>';
                    }


                    if ($(this).find('content').children('para').length == 0) {
                        content_html_temp += $(this).find('content').text();
                    } else {
                        for (var m = 0; m < this.getElementsByTagName("content")[0].childNodes.length; m++)
                        {
                            if (this.getElementsByTagName("content")[0].childNodes[m].nodeName == 'para') {
                                content_html_temp += xmlText.serializeToString(this.getElementsByTagName("content")[0].childNodes[m]);
                            }
                        }
                    }
                }

                var notes_html_temp = '';
                if ($(this).find('notes').length != 0) {
                    if ($(this).find('notes').children('para').length == 0) {
                        notes_html_temp += $(this).find('notes').text();
                    } else {
                        for (var m = 0; m < this.getElementsByTagName("notes")[0].childNodes.length; m++)
                        {
                            if (this.getElementsByTagName("notes")[0].childNodes[m].nodeName == 'para') {
                                notes_html_temp += xmlText.serializeToString(this.getElementsByTagName("notes")[0].childNodes[m]);
                            }
                        }
                    }
                }

                if ($('.show_structre').children('.tick_mark').hasClass('_selected') || $('.show_all').children('.tick_mark').hasClass('_selected')) {
                    if ($(this).children('name').length != 0 && $(this).children('name').text() != "") {
                        content_data += '<div class="content_box"><div class="sturcture_content" style="text-align:' + $(this).attr('align') + '">';
                        content_data += '<p>' + $(this).find('name').text() + '</p>';
                    } else {
                        if ($(this).children('desc').length != 0 && $(this).children('desc').text() != "") {
                            content_data += '<div class="content_box"><div class="sturcture_content" style="text-align:' + $(this).attr('align') + '">';
                        }
                    }
                    if ($(this).children('desc').length != 0 && $(this).children('desc').text() != "") {
                        content_data += '<p>' + $(this).find('desc').text() + '</p>';
                        content_data += '</div></div>';
                    } else {
                        content_data += '</div></div>';
                    }
                }
                if ($('.show_notes').is(':visible')) {
                    if ($('.show_notes').children('.tick_mark').hasClass('_selected') || $('.show_all').children('.tick_mark').hasClass('_selected')) {
                        if ($(this).children('notes').length != 0 && $(this).children('notes').text() != "" && typeof ($(this).children('notes').attr('dup')) == 'undefined') {
                            content_data += '<div class="content_box"><div class="notes_content italic_style" style="text-align:' + $(this).attr('align') + '">';
                            content_data += notes_html_temp;
                            content_data += '</div></div>';
                        }
                    }
                }
                if ($('.show_content').is(':visible')) {
                    if ($('.show_content').children('.tick_mark').hasClass('_selected') || $('.show_all').children('.tick_mark').hasClass('_selected')) {
                        if ($(this).children('content').length != 0 && $(this).children('content').text() != "" && typeof ($(this).children('content').attr('dup')) == 'undefined') {
                            content_data += xml_img;
                            content_data += '<div class="content_box"><div class="content_contents" style="text-align:' + $(this).attr('align') + '">';
                            content_data += content_html_temp;
                            content_data += '</div></div>';
                        }
                    }
                }

                if (tag_status) {
                    content_data += '</div>';
                }
            });
            content_data = content_data.toString();
            if (content_data != '') {
                content_data = content_data.replace(/<para/g, " <p");
                content_data = content_data.replace(/<useful/g, " <span");
                content_data = content_data.replace(/<extra_info/g, " <span");
                content_data = content_data.replace(/<\/para/g, " </p");
                content_data = content_data.replace(/<\/useful/g, "</span");
                content_data = content_data.replace(/<\/extra_info/g, "</span");
                content_data = content_data.replace(/  /g, " ");
                content_data = content_data.replace(/ ,/g, ",");
                content_data = content_data.replace(/ <\/span>,/g, "</span>,");
                content_data = content_data.replace(/\s<\/span>\./g, "</span>.");
                content_data = content_data.replace(/ <\/span> /g, " </span>");
                content_data = content_data.replace(/<\/span>\.\./g, "</span>.");
                content_data = content_data.replace(/\' /g, "'");
            }



            $('.models_content').html(content_data);
			var tempHeight = ($('.models_page_body_right').height() - $('.models_page_body_right .models_header').height() - 10);
            $('.models_content').css('height', tempHeight);
            $('.models_content').css('overflow-y', 'auto');
            _this.db_clk();
            $('.cont_wrp_box').each(function () {
                if ($(this).html() == '') {
                    $(this).remove();
                }
            });
            //need to load config xml
            var tempTxt = $(_this.config_msg).find('commentary_help').text();
            if (tempTxt.indexOf("Diccionario") != (-1)) {
                tempTxtArr = tempTxt.split("Diccionario");
                tempTxtArr[2] = tempTxtArr[0] + "<i>Diccionario " + tempTxtArr[1] + "</i>";
                tempTxt = '<p>' + tempTxtArr[2] + '</p>';
            }

            $('.models_header').html('<p>' + tempTxt + '</p>');
            var show_top_head = true;
            $('.str_common:visible').each(function () {
                if ($(this).children('.tick_mark').hasClass('_selected')) {
                    show_top_head = false;
                }
            });
            //console.log(show_top_head);
            if (show_top_head) {
                $('.models_header').empty();
            }

        });
        $('.str_common').each(function () {
            if ($(this).hasClass('show_all')) {
                $(this).trigger(event_type);
                return false;
            }
        });
    };
    this.leftPanelWriter = function (element, wrapper) {
        _this.writerInit();
        var project_html = '';
        for (var key in _this.project_xml_data) {
            if (_this.project_xml_data[key]['framework_enabled'] === 'true') {
                project_html = project_html + '<' + element + ' data-key="' + key + '"><div class="li_inner"><span class="sp_left" data-key="' + key + '">' + _this.project_xml_data[key]['project_name'] + '</span><span class="info_ic"></span></div><div class="info_text">' + _this.project_xml_data[key]['framework_summery'] + '</div>' + '</' + element + '>';
            }
        }
        $('.left_menu').show();
        $('.second_page_body_left').css('left', '0');
        $(wrapper).empty().append(project_html);
        $('.second_page_top h1').html(jsonData["type_of_writing"]);
        if (Number($(window).width()) <= 480) {
            $('.second_page_top h1').text(jsonData["choose_a_model"]);
        }

        $(".info_ic").each(function (index, element) {

            $(this).attr('data-show', 'hide');
            $(this).bind(event_type, function (e) {
                if ($(window).width() <= 768) {
                    //$(".info_text").hide("blind");
                    ///$(this).parent().next().show("blind");

                    $(".info_text").slideUp();
                    $(".info_ic").css('background-image', 'url("images/mitr/oxford/info_01.png")');
                    if ($(this).attr('data-show') == 'hide') {
                        $(this).parent().next().slideDown();
                        $(this).attr('data-show', 'show');
                        $(this).css('background-image', 'url("images/mitr/info_btn_active.png")');
                    } else {
                        $(".info_text").slideUp();
                        $(this).attr('data-show', 'hide');
                        $(this).css('background-image', 'url("images/mitr/oxford/info_01.png")');
                    }
                }
            });
            $(this).mouseover(function (e) {
                if ($(window).width() > 768) {
                    var pos = $(this).position();
                    $('.arrow_box').html($(this).parents('.li_inner').next().html());
                    $('.arrow_wrp').css('top', pos.top - ($('.arrow_wrp').height() / 2) + 16);
                    $('.arrow_wrp').css('left', pos.left + 36);
                    $('.arrow_wrp').show();
                    $(this).css('background-image', 'url("images/mitr/info_btn_active.png")');
                }
            }).mouseout(function (e) {
                if ($(window).width() > 768) {
                    $('.arrow_wrp').hide();
                    $(this).css('background-image', 'url("images/mitr/oxford/info_01.png")');
                }
            });
            $('.sp_left').off().on(event_type, function (e1) {


                //for device
                e1.preventDefault();
                $('.tool_wrapper,.down_arrow_wrapper').hide();
                var left_pos = $('.second_page_body_left').position();
                $('.second_page_body').scrollTop(0);
                $('.second_page_body_left').stop();
                if (Number(left_pos.left) == 0) {
                    if ($(window).width() <= 480) {
                        $('.second_page_body_left').animate({'left': '-100%'});
                        $('.left_menu').css('background-position', '0px 0px');
                    } else {
                        $('.second_page_body_left').animate({'left': '-100%'});
                        $('.left_menu').css('background-position', '0px 0px');
                    }
                    //$('.models_page_body,.second_page_body,.second_page_body_left,.models_page_body_left').css('overflow-y', 'scroll');
                } else {
                    $('.second_page_body_left').animate({'left': '0'});
                    $//('.second_page_body').css('overflow', 'hidden');
                    $('.left_menu').css('background-position', '-5px 0px');
                }
                //end for device


                var head_html = '<div class="models_header w_models_header"><p>' + $(this).parents('.li_inner').next().html() + '</p></div>';
                head_html += '<div class="create_project create_pro_btn" data-type="create" data-key="' + $(this).attr('data-key') + '">' + jsonData["create_a_project"] + '</div>';
                _this.current_key = $(this).attr('data-key');
                var postData = {'data-key': _this.current_key};
                html5sql.process(
                        {
                            sql: "SELECT * FROM iwriter_windows WHERE data_id  = " + _this.current_key + " AND language = '" + _this.lang + "'order by date_time DESC",
                            success: function (transaction, results, rowArray) {
                                var temp_html = '';
                                //if (rowArray.length != 0) {
                                for (var i in rowArray) {

                                    var _name = rowArray[i]['name'].replace(/\#\|\#/g, "'");
                                    _name = _name.replace(/\#\|\|\#/g, '"');
                                    temp_html += '<div class="create_project" data-key="' + rowArray[i]['data_id'] + '" data-project="' + rowArray[i]['name'] + '" data-type="save">' + _name + '<br>' + rowArray[i]['dtime'] + '</div>';
                                    temp_html += '<div class="delete_project" data-key="' + rowArray[i]['id'] + '">X</div>';
                                }
                                head_html += temp_html;
                                $('.second_page_body_right').show().empty().html(head_html);
                                $('.second_page_body_right .delete_project').unbind(event_type).bind(event_type, function (e2) {
                                    e2.preventDefault();
                                    //alert('delete pressed');


                                    var delete_id = $(this).attr('data-key');
                                    var temp_this = this;
                                    //var r = confirm("Are you sure you want to delete this project?");

                                    $('.white_content').remove();
                                    var temp_pop = '<div class="white_content" style="top:50%;left:55%;"><div class="pop_wrap"><div class="pop_msg">' + jsonData["delete_project"] + '</div><div class="btn_wrp"><div class="can_btn_pop">' + jsonData["cancel"] + '</div><div class="ok_btn_pop">' + jsonData["ok"] + '</div></div></div></div>';
                                    $('body').append(temp_pop);
                                    $('.white_content').show();
                                    $('.ok_btn_pop').off(event_type).on(event_type, function () {
                                        $('.white_content').hide();
                                        html5sql.process(
                                                {
                                                    sql: "DELETE FROM iwriter_windows WHERE id = " + delete_id + ";",
                                                    success: function (transaction, results, rowArray) {
                                                        if (results.rowsAffected == 1) {
                                                            $(temp_this).prev().remove();
                                                            $(temp_this).remove();
                                                        } else {
                                                            alert('Please  try again');
                                                        }
                                                    }
                                                }
                                        );
                                        /*
                                         var formURL = 'database.php?delete';
                                         var postData = {'id': delete_id};
                                         $.ajax(
                                         {
                                         url: formURL,
                                         type: "POST",
                                         data: postData,
                                         success: function(data, textStatus, jqXHR)
                                         {
                                         if (data == '0') {
                                         alert('Please  try again');
                                         } else {
                                         $(temp_this).prev().remove();
                                         $(temp_this).remove();
                                         }
                                         },
                                         error: function(jqXHR, textStatus, errorThrown)
                                         {
                                         //if fails
                                         alert('Please  try again');
                                         }
                                         }
                                         );*/

                                    });
                                    $('.can_btn_pop').off(event_type).on(event_type, function () {
                                        $('.white_content').hide();
                                    });
                                    return false;
                                });
                                $('.create_project').off().on(event_type, function (e3) {
                                    if ($(this).attr('data-type') == 'create') {
                                        _this.current_pro_name = '';
                                    } else {
                                        _this.current_pro_name = $(this).attr('data-project');
                                    }
                                    _this.create_project($(this).attr('data-key'), $(this).attr('data-type'), $(this).attr('data-project'));
                                });
                                //}
                            }
                        }
                );
                /*
                 var formURL = 'database.php?fetchmodel';
                 $.ajax(
                 {
                 url: formURL,
                 type: "POST",
                 data: postData,
                 success: function(data, textStatus, jqXHR)
                 {
                 if (data == '0') {

                 } else {
                 head_html += data;
                 }
                 $('.second_page_body_right').show().empty().html(head_html);
                 $('.second_page_body_right .delete_project').unbind(event_type).bind(event_type, function(e2) {
                 e2.preventDefault();
                 //alert('delete pressed');


                 var delete_id = $(this).attr('data-key');
                 var temp_this = this;


                 //var r = confirm("Are you sure you want to delete this project?");

                 $('.white_content').remove();
                 var temp_pop = '<div class="white_content"><div class="pop_wrap"><div class="pop_msg">Are you sure you want to delete this project?</div><div class="btn_wrp"><div class="can_btn_pop">Cancel</div><div class="ok_btn_pop">OK</div></div></div></div>';
                 $('body').append(temp_pop);
                 $('.white_content').show();

                 $('.ok_btn_pop').off(event_type).on(event_type, function() {
                 $('.white_content').hide();

                 var formURL = 'database.php?delete';
                 var postData = {'id': delete_id};
                 $.ajax(
                 {
                 url: formURL,
                 type: "POST",
                 data: postData,
                 success: function(data, textStatus, jqXHR)
                 {
                 if (data == '0') {
                 alert('Please  try again');
                 } else {
                 $(temp_this).prev().remove();
                 $(temp_this).remove();
                 }
                 },
                 error: function(jqXHR, textStatus, errorThrown)
                 {
                 //if fails
                 alert('Please  try again');
                 }
                 }
                 );

                 });
                 $('.can_btn_pop').off(event_type).on(event_type, function() {
                 $('.white_content').hide();
                 });



                 return false;
                 });
                 $('.create_project').off().on(event_type, function(e3) {
                 if ($(this).attr('data-type') == 'create') {
                 _this.current_pro_name = '';
                 } else {
                 _this.current_pro_name = $(this).attr('data-project');
                 }
                 _this.create_project($(this).attr('data-key'), $(this).attr('data-type'), $(this).attr('data-project'));
                 });
                 },
                 error: function(jqXHR, textStatus, errorThrown)
                 {
                 //if fails

                 }
                 }
                 );*/
            });
        });
    };
    this.writerInit = function () {
        // writer init
        _this.current_tool = 'writer';
        $('.inner_wrapper').css('overflow', 'hidden');
        $('.current_tool').text(jsonData["model"]);
        _this.reset_drop();
        $('.current_tool').off(event_type).on(event_type, function (e) {
            if ($('.second_page').is(':visible')) {
                $('.fn_left').trigger(event_type);
            } else {
                _this.switchToModel();
            }
        });
        console.log("its here");
        $('.search_title p:first-child').text(jsonData["choose_what_to_show"]);
        $('.search_title p:last-child').text(jsonData["change_the_view"]);
        $('.iwriter_t').show();
        $('.top_model_menu_text,.models_page_menu_text').html(jsonData["writer"]);
        // end writer init
    };
    this.switchToModel = function () {

        if ($(_this.project_xml_data[_this.current_key]['xml_data']).find('step').length != 0) {
            //when model exists
            if (_this.show_popup) {
                show_pop();
            } else {
                $('.white_content').hide();
                _this.modelInit();
                _this.createModel(_this.project_xml_data[_this.current_key]['project_name'], _this.current_key);
            }
        } else {
            if (_this.show_popup) {
                show_pop();
            } else {
                $('.fn_left').trigger(event_type);
            }

        }

        function show_pop() {
            $('.white_content').remove();
            var temp_pop = '<div class="white_content"><div class="pop_wrap"><div class="pop_msg">' + jsonData['leave_your_project'] + '</div><div class="btn_wrp"><div class="can_btn_pop">' + jsonData['cancel'] + '</div><div class="ok_btn_pop">' + jsonData['ok'] + '</div></div></div></div>';
            $('body').append(temp_pop);
            $('.white_content').show();
            $('.ok_btn_pop').off(event_type).on(event_type, function () {
                $('.white_content').hide();
                _this.modelInit();
                _this.createModel(_this.project_xml_data[_this.current_key]['project_name'], _this.current_key);
				_this.show_popup = false;
            });
            $('.can_btn_pop').off(event_type).on(event_type, function () {
                $('.white_content').hide();
            });
        }
    };
    this.switchFromWriter = function () {
        //if ($(_this.project_xml_data[_this.current_key]['xml_data']).find('step').length != 0) {
        //when model exists
        if (_this.show_popup) {
            $('.white_content').remove();
            var temp_pop = '<div class="white_content"><div class="pop_wrap"><div class="pop_msg">' + jsonData['leave_your_project'] + '</div><div class="btn_wrp"><div class="can_btn_pop">' + jsonData['cancel'] + '</div><div class="ok_btn_pop">' + jsonData['ok'] + '</div></div></div></div>';
            $('body').append(temp_pop);
            $('.white_content').show();
            $('.ok_btn_pop').off(event_type).on(event_type, function () {
                $('.white_content').hide();
                hide_elem();
                $('.fn_rigth').trigger(event_type);
				_this.show_popup = false;
            });
            $('.can_btn_pop').off(event_type).on(event_type, function () {
                $('.white_content').hide();
            });
        } else {
            $('.white_content').hide();
            hide_elem();
            $('.fn_rigth').trigger(event_type);
        }

        //} else {
        //hide_elem();
        //$('.fn_rigth').trigger(event_type);
        //}
        function hide_elem() {
            $('.common_page').hide();
            $('.second_page').show();
            $('.tool_wrapper,.down_arrow_wrapper').hide();
            $('.second_page_body_right').hide();
            $('.second_page_body_left').css('left', '0');
        }
    };
    this.switchToHome = function () {
        if (_this.current_tool == 'model') {
            hide_elem();
        } else {
            if (typeof _this.current_key != 'undefined' && $(_this.project_xml_data[_this.current_key]['xml_data']).find('step').length != 0) {
                //when model exists
                if (_this.show_popup) {
                    show_pop();
                } else {
                    $('.white_content').hide();
                    hide_elem();
                }

            } else {
                if (_this.show_popup) {
                    show_pop();
                } else {
                    hide_elem();
                }
            }
        }
        function show_pop() {
            $('.white_content').remove();
            var temp_pop = '<div class="white_content"><div class="pop_wrap"><div class="pop_msg">' + jsonData['leave_your_project'] + '</div><div class="btn_wrp"><div class="can_btn_pop">' + jsonData['cancel'] + '</div><div class="ok_btn_pop">' + jsonData['ok'] + '</div></div></div></div>';
            $('body').append(temp_pop);
            $('.white_content').show();
            $('.ok_btn_pop').off(event_type).on(event_type, function () {
                $('.white_content').hide();
                hide_elem();
            });
            $('.can_btn_pop').off(event_type).on(event_type, function () {
                $('.white_content').hide();

            });
            // hide_elem();
        }
        function hide_elem() {
            window.location.href = window.location.href;
        }
    };
    this.create_project = function (data_key, data_type, data_project) {
        //$('.create_project').off().on(event_type, function(e) {
        _this.current_tool = 'writer';
        $('.current_tool').text(jsonData["model"]);
        $('.current_tool').off(event_type).on(event_type, function (e) {
            if ($('.second_page').is(':visible')) {
                $('.fn_left').trigger(event_type);
            } else {
                _this.switchToModel();
            }
        });
        $('.inner_wrapper').css('overflow', 'hidden');
        $('.tool_down_arrow').show();
        $('.top_model_menu_text,.models_page_menu_text').html(jsonData['my_writing']);
        _this.reset_drop();
        //e.preventDefault();
        _this.project_short_name = '';
        $('.common_page').hide();
        $('.info_text').hide();
        $('.models_page').show();
        if ($(window).width() <= 480) {
            var left_pos = $('.models_page_body_left').position();
            if (Number(left_pos.left) == 0) {
                //$('.models_page_body').css('overflow', 'hidden');
            }
        }

        $('.str_common').each(function () {
            $(this).children('.tick_mark').removeClass('_selected');
        });
        $('.models_page_left_panel h1').html(_this.project_xml_data[data_key]['project_name']);
        //$('.models_page_body .left_wrapper').empty();

        $('.models_header').empty();
        $('.models_content').empty();
        var guided_html = '';
        var parent = this;
        _this.current_key = data_key;
        _this.save_type = data_type;
        _this.data_project = data_project;
        //check for filter
        var notes_status = false;
        var content_status = false;
        $('.str_common').show();
        _this.project_short_name = _this.project_xml_data[_this.current_key]['short_name'];
        if ($(window).width() <= 768) {
            if (_this.project_short_name != '') {
                $('.models_page_left_panel h1').html(_this.project_short_name);
            }
        }

        $(_this.project_xml_data[_this.current_key]['xml_data']).find('paragraph').each(function () {

            if ($(this).find('notes').length != 0) {
                notes_status = true;
            }

            if ($(this).find('content').length != 0) {
                content_status = true;
            }
        });
        if (!notes_status) {
            $('.show_notes').hide();
        }
        if (!content_status) {
            $('.show_content').hide();
        }
        //end check for filter


        $('.str_common').off(event_type).on(event_type, function () {
            _this.writer_btns(this);
        });
        $('.show_all').trigger(event_type);
        //right side content
        $('.models_header').empty();
        $('.models_content').empty();
        var content_data = '';
        var xml_dom = '';
        if (_this.save_type == 'create') {
            xml_dom = _this.project_xml_data[_this.current_key]['xml_data'];
            $(_this.project_xml_data[_this.current_key]['xml_data']).find('content').each(function () {
                $(this).removeAttr('data-val');
            });
            $(_this.project_xml_data[_this.current_key]['xml_data']).find('notes').each(function () {
                $(this).removeAttr('data-val');
            });
            _this.load_save_project(xml_dom);
        } else {
            //alert('project_name::' + data_project + 'current_key::' + _this.current_key);
            //data_project = data_project.replace(/'/g, '&#39;');
            //data_project = data_project.replace(/"/g, '&#34;');
            html5sql.process(
                    {
                        sql: "SELECT * FROM iwriter_windows WHERE data_id = " + _this.current_key + " AND name = '" + data_project + "' AND language = '" + _this.lang + "';",
                        success: function (transaction, results, rowArray) {
                            if (rowArray.length != 0) {
                                $('.save_pro').attr('data-project-name', data_project);
                                var data = rowArray[0]['data'];
                                data = data.replace(/\#\|\#/g, "'");
                                data = data.replace(/\#\|\|\#/g, '"');
                                _this.load_save_project(_this.StringToXML(data));
                            }
                        }
                    }
            );
            /*var postData = {'data-key': _this.current_key, 'project_name': data_project};
             var formURL = 'database.php?fetch';
             $.ajax(
             {
             url: formURL,
             type: "POST",
             data: postData,
             //dataType: "xml",
             success: function(data, textStatus, jqXHR)
             {
             if (data == '0') {

             } else {
             //xml_dom = data;
             $('.save_pro').attr('data-project-name', data_project);
             _this.load_save_project(_this.StringToXML(data));
             }
             },
             error: function(jqXHR, textStatus, errorThrown)
             {
             //if fails
             alert('Please try again');
             }
             }
             );*/
        }


        //});
    };
    this.load_save_project = function (xml_dom) {
        var content_data = '';
        $(xml_dom).find('paragraph').each(function () {


            var tag_status = false;
            var xml_img = '';
            if ($(this).find('content').length != 0 || $(this).find('notes').length != 0 || $(this).find('name').length != 0 || $(this).find('desc').length != 0) {
                tag_status = true;
            }

            if (tag_status) {
                content_data += '<div class="cont_wrp_box">';
            }


            var content_html_temp = '';
            var xmlText = new XMLSerializer();
            if ($(this).find('content').length != 0) {

                if ($(this).find('content').length != 0) {
                    if (typeof ($(this).find('content').attr('data-val')) != 'undefined') {
                        content_html_temp += $(this).find('content').attr('data-val');
                    } else {
                        if (typeof ($(this).find('content').attr('prompt')) != 'undefined') {
                            content_html_temp += $(this).find('content').attr('prompt');
                        } else {
                            content_html_temp += jsonData["type_your_paragraph_here"];
                        }
                    }
                }
            }
            $('.search_title p:first-child').text(jsonData["choose_what_to_show"]);
            $('.search_title p:last-child').text(jsonData['change_the_view']);
            if ($('.show_structre').children('.tick_mark').hasClass('_selected') || $('.show_all').children('.tick_mark').hasClass('_selected')) {
                if ($(this).children('name').length != 0 && $(this).children('name').text() != "") {
                    content_data += '<div class="content_box"><div class="sturcture_content" style="text-align:' + $(this).attr('align') + '">';
                    content_data += '<p>' + $(this).find('name').text() + '</p>';
                    if ($(this).children('tip').length != 0 && $(this).children('desc').length == 0) {
                        content_data += '<p>' + $(this).find('tip').text() + '</p>';
                    }

                } else {
                    if ($(this).children('desc').length != 0 && $(this).children('desc').text() != "") {
                        content_data += '<div class="content_box"><div class="sturcture_content" style="text-align:' + $(this).attr('align') + '">';
                    }
                }

                if ($(this).children('desc').length != 0 && $(this).children('desc').text() != "") {
                    content_data += '<p>' + $(this).find('desc').text() + '</p>';
                    if ($(this).children('tip').length != 0) {
                        content_data += '<p>' + $(this).find('tip').text() + '</p>';
                    }
                    content_data += '</div></div>';
                } else {
                    content_data += '</div></div>';
                }
            }
            if ($('.show_notes').children('.tick_mark').hasClass('_selected') || $('.show_all').children('.tick_mark').hasClass('_selected')) {
                if ($(this).children('notes').length != 0 && typeof ($(this).children('notes').attr('dup')) == 'undefined') {
                    var temp_pl = '';
                    if (typeof ($(this).find('notes').attr('data-val')) != 'undefined') {
                        temp_pl += $(this).find('notes').attr('data-val');
                    } else {
                        temp_pl += jsonData['type_your_notes_here'];
                    }
                    if (_this.lang != "en") {
                        content_data += '<div class="content_box"><div data-ph="' + jsonData['type_your_notes_here'] + '" class="notes_content" contenteditable="true" onpaste="handlepaste(this, event)" style="text-align:' + $(this).attr('align') + '">';
                    } else {
                        content_data += '<div class="content_box"><div data-ph="' + jsonData['type_your_notes_here'] + '" class="notes_content italic_style" contenteditable="true" onpaste="handlepaste(this, event)" style="text-align:' + $(this).attr('align') + '">';
                    }

                    content_data += temp_pl;
                    content_data += '</div></div>';
                }
            }
            if ($('.show_content').children('.tick_mark').hasClass('_selected') || $('.show_all').children('.tick_mark').hasClass('_selected')) {
                if ($(this).children('content').length != 0 && typeof ($(this).children('content').attr('dup')) == 'undefined') {
                    var temp_pl = '';
                    if (typeof ($(this).find('content').attr('prompt')) != 'undefined') {
                        temp_pl += $(this).find('content').attr('prompt');
                    } else {
                        temp_pl += jsonData["type_your_paragraph_here"];

                    }
                    content_data += '<div class="content_box"><div data-ph="' + temp_pl + '" class="content_contents" contenteditable="true" onpaste="handlepaste(this, event)" data-align="' + $(this).attr('align') + '" style="text-align:' + $(this).attr('align') + '">';
                    content_data += content_html_temp;
                    content_data += '</div></div>';
                }
            }
            if (tag_status) {
                content_data += '</div>';
            }
        });
        content_data = content_data.toString();
        if (content_data != '') {
            content_data = content_data.replace(/<para/g, " <p");
            content_data = content_data.replace(/<useful/g, " <span");
            content_data = content_data.replace(/<extra_info/g, " <span");
            content_data = content_data.replace(/<\/para/g, " </p");
            content_data = content_data.replace(/<\/useful/g, " </span");
            content_data = content_data.replace(/<\/extra_info/g, " </span");
            content_data = content_data.replace(/  /g, " ");
            content_data = content_data.replace(/ ,/g, ",");
            content_data = content_data.replace(/ <\/span>,/g, "</span>,");
            content_data = content_data.replace(/\s<\/span>\./g, "</span>.");
            content_data = content_data.replace(/ <\/span> /g, " </span>");
            content_data = content_data.replace(/<\/span>\.\./g, "</span>.");
            content_data = content_data.replace(/\' /g, "'");
        }



        $('.models_content').html(content_data);
		var tempHeight = ($('.models_page_body_right').height() - $('.models_page_body_right .models_header').height() - 10);
        $('.models_content').css('height', tempHeight);
        $('.models_content').css('overflow-y', 'auto');
        _this.db_clk();
        //placeholder functionality

        $('.content_contents').keyup(function () {
            _this.wordCount();
        });
        $(".notes_content").keyup(function () {
            if ($(this).text().trim() == "") {
                if (_this.lang != "en") {
                    if ($(this).hasClass("notes_content")) {
                        $(this).removeClass("italic_style");
                    }
                }
            } else {
                if ($(this).hasClass("notes_content")) {
                    $(this).addClass("italic_style");
                }
            }
        });


        $(".models_content div[contenteditable='true']").css('min-height', '23px').css('border-top', '1px solid grey').css('border-right', '1px solid grey').css('border-bottom', '1px solid grey');
        $(".models_content div[contenteditable='true']").focus(function () {
            if ($(this).text().trim() == $(this).attr('data-ph')) {
                $(this).text('');
            }
        });
        $(".models_content div[contenteditable='true']").focusout(function () {
            _this.show_popup = false;
            $(".models_content div[contenteditable='true']").each(function () {
                if ($(this).text().trim() != '') {
                    if ($(this).attr('data-ph') != $(this).text()) {
                        _this.show_popup = true;
                    }
                }

            });
        });
        $(".models_content div[contenteditable='true']").blur(function () {
            if ($(this).text().trim() == "") {
                $(this).text($(this).attr('data-ph'));
            }
            _this.show_popup = false;
            $(".models_content div[contenteditable='true']").each(function () {
                if ($(this).text().trim() != '') {
                    if ($(this).attr('data-ph') != $(this).text()) {
                        _this.show_popup = true;
                    }
                }

            });
        });
        //end of placeholder functionality

        _this.set_wheader();
        _this.wordCount();
        //end right side content

        //left side content
        var checklist_cnt = 0;
        var top_html_ck = '<div class="check_content"><div class="check_top"><span>' + jsonData['use_formal_and_impersonal_language'] + '</span></div><div class="check_con"></div></div>';
        top_html_ck += '<div class="checklist_wrp" ><ul class="checklist_ul">';
        var statis_menu = new Array();
        statis_menu[0] = jsonData['before_you_start'];
        statis_menu[1] = jsonData['choose_your_language'];
        statis_menu[2] = jsonData['while_you_are_writing'];
        statis_menu[3] = jsonData['check'];
        $(_this.project_xml_data[_this.current_key]['xml_data']).find('planning').each(function () {
            top_html_ck += '<li>';
            top_html_ck += '<div class="menu_1">' + statis_menu[0] + '</div><div class="checkpoints"><ul class="checkpoints_ul">';
            $(this).find('point').each(function (_index) {
                top_html_ck += '<li>';
                top_html_ck += '<div><span class="check_box_w"><input type="checkbox"/></span><span class="checklist_p">' + $(this).text() + '</span></div>';
                if (typeof ($(this).attr('help')) != 'undefined') {
                    top_html_ck += '<span class="tell_me_btn" data-file="' + $(this).attr('help') + '">' + jsonData['tell_me_more'] + '</span>';
                }

                top_html_ck += '</li>';
            });
            top_html_ck += '</ul></div>';
            top_html_ck += '</li>';
        });
        $(_this.project_xml_data[_this.current_key]['xml_data']).find('vocab').each(function () {
            top_html_ck += '<li>';
            top_html_ck += '<div class="menu_1">' + statis_menu[1] + '</div><div class="checkpoints"><ul class="checkpoints_ul">';
            $(this).find('point').each(function (_index) {
                top_html_ck += '<li>';
                top_html_ck += '<div><span class="check_box_w"><input type="checkbox"/></span><span class="checklist_p">' + $(this).text() + '</span></div>';
                if (typeof ($(this).attr('help')) != 'undefined') {
                    top_html_ck += '<span class="tell_me_btn" data-file="' + $(this).attr('help') + '">' + jsonData['tell_me_more'] + '</span>';
                }

                top_html_ck += '</li>';
            });
            top_html_ck += '</ul></div>';
            top_html_ck += '</li>';
        });
        $(_this.project_xml_data[_this.current_key]['xml_data']).find('writing').each(function () {
            top_html_ck += '<li>';
            top_html_ck += '<div class="menu_1">' + statis_menu[2] + '</div><div class="checkpoints"><ul class="checkpoints_ul">';
            $(this).find('point').each(function (_index) {
                top_html_ck += '<li>';
                top_html_ck += '<div><span class="check_box_w"><input type="checkbox"/></span><span class="checklist_p">' + $(this).text() + '</span></div>';
                if (typeof ($(this).attr('help')) != 'undefined') {
                    top_html_ck += '<span class="tell_me_btn" data-file="' + $(this).attr('help') + '">' + jsonData['tell_me_more'] + '</span>';
                }

                top_html_ck += '</li>';
            });
            top_html_ck += '</ul></div>';
            top_html_ck += '</li>';
        });
        $(_this.project_xml_data[_this.current_key]['xml_data']).find('checking').each(function () {
            top_html_ck += '<li>';
            top_html_ck += '<div class="menu_1">' + statis_menu[3] + '</div><div class="checkpoints"><ul class="checkpoints_ul">';
            $(this).find('point').each(function (_index) {
                top_html_ck += '<li>';
                top_html_ck += '<div><span class="check_box_w"><input type="checkbox"/></span><span class="checklist_p">' + $(this).text() + '</span></div>';
                if (typeof ($(this).attr('help')) != 'undefined') {
                    top_html_ck += '<span class="tell_me_btn" data-file="' + $(this).attr('help') + '">tell me more...</span>';
                }

                top_html_ck += '</li>';
            });
            top_html_ck += '</ul></div>';
            top_html_ck += '</li>';
        });
        top_html_ck += '</ul></div>';
        $('.left_wrapper').empty().html(top_html_ck);
        $('.checkpoints').hide();
        $('.menu_1').off(event_type).on(event_type, function (e_p) {

            if (!$(this).hasClass('_select')) {
                $(this).addClass('_select');
                $(this).next('.checkpoints').show('blind');
                $(this).parent('li').css('background-image', 'url("images/mitr/up_a.png")');
                var pr_thi = this;
                $('.menu_1').each(function (e_c) {
                    if (pr_thi != this) {
                        $(this).next('.checkpoints').hide('blind');
                        $(this).removeClass('_select');
                        $(this).parent('li').css('background-image', 'url("images/mitr/down_a.png")');
                    }
                });
            } else {
                $(this).next('.checkpoints').hide('blind');
                $(this).removeClass('_select');
                $(this).parent('li').css('background-image', 'url("images/mitr/down_a.png")');
            }
        });
        $('.check_top').off(event_type).on(event_type, function () {
            $('.check_content').hide();
            $('.checklist_wrp').show();
        });
        $('.tell_me_btn').off(event_type).on(event_type, function () {
            $('.check_top span').text($(this).parent().find('.checklist_p').text());
            $('.check_content').show();
            $('.checklist_wrp').hide();
            $('.check_con').html(tell_more[$(this).attr('data-file')]);
        });
        //left side content

        //load btn
        var load_status = true;
        $('.load_pro').mouseover(function () {
            if (load_status) {
//ajax
                load_status = false;
                var postData = {'data-key': _this.current_key};
                html5sql.process(
                        {
                            sql: "SELECT * FROM iwriter_windows WHERE data_id = " + postData['data-key'] + " AND language = '" + _this.lang + "' order by date_time DESC;",
                            success: function (transaction, results, rowArray) {
                                if (rowArray.length != 0) {

                                    var temp_html = '<ul>';
                                    for (var i in rowArray) {

                                        var _name = rowArray[i]['name'].replace(/\#\|\#/g, "'");
                                        _name = _name.replace(/\#\|\|\#/g, '"');
                                        temp_html += '<li data-type="save" data-project="' + rowArray[i]['name'] + '" data-key="' + rowArray[i]['data_id'] + '">' + _name + '</li>';
                                    }
                                    temp_html += '</ul>';
                                    $('.prolist_load').empty().html(temp_html);
                                    $('.load_pop_d').show().css('right', '105%').css('top', '0px');
                                    $('.tool_down_arrow_wrp li,.tool_wrapper li').mouseout(function () {
                                        if (!$(this).hasClass('load_pro')) {
                                            $('.load_pop_d').hide();
                                        }
                                    });
                                    $('.prolist_load li').off(event_type).on(event_type, function () {
                                        var _li_this = this;
                                        if (_this.show_popup) {
                                            $('.white_content').remove();
                                            var temp_pop = '<div class="white_content"><div class="pop_wrap"><div class="pop_msg">' + jsonData['leave_your_project'] + '</div><div class="btn_wrp"><div class="can_btn_pop">' + jsonData['cancel'] + '</div><div class="ok_btn_pop">' + jsonData['ok'] + '</div></div></div></div>';
                                            $('body').append(temp_pop);
                                            $('.white_content').show();

                                            _this.current_pro_name = $(this).attr('data-project');
                                            $('.ok_btn_pop').off(event_type).on(event_type, function () {
												$('.white_content').hide();
                                                $('.load_pop_d').hide();
                                                _this.show_popup = false;

                                                iWriter_controller.create_project($(_li_this).attr('data-key'), $(_li_this).attr('data-type'), $(_li_this).attr('data-project'));
                                            });
                                            $('.can_btn_pop').off(event_type).on(event_type, function () {
                                                $('.white_content').hide();
                                            });
                                        } else {
                                            $('.load_pop_d').hide();
                                            _this.show_popup = false;
                                            _this.current_pro_name = $(this).attr('data-project');
                                            iWriter_controller.create_project($(this).attr('data-key'), $(this).attr('data-type'), $(this).attr('data-project'));
                                        }
                                    });
                                } else {
                                    $('.prolist_load').empty();
                                    $('.load_pop_d').hide();
                                }
                            }
                        }
                );
                /*var formURL = 'database.php?fetch_project';
                 $.ajax(
                 {
                 url: formURL,
                 type: "POST",
                 data: postData,
                 success: function(data, textStatus, jqXHR)
                 {
                 if (data == '0') {
                 //alert('no projects found');
                 $('.prolist_load').empty();
                 $('.load_pop_d').hide();
                 } else {
                 $('.prolist_load').empty().html(data);
                 $('.load_pop_d').show().css('right', '105%').css('top', '0px');
                 $('.tool_down_arrow_wrp li,.tool_wrapper li').mouseout(function() {
                 if (!$(this).hasClass('load_pro')) {
                 $('.load_pop_d').hide();
                 }
                 });

                 $('.prolist_load li').off(event_type).on(event_type, function() {
                 if (_this.show_popup) {
                 $('.white_content').remove();
                 var temp_pop = '<div class="white_content"><div class="pop_wrap"><div class="pop_msg">Do you want to leave your project without saving your latest changes?</div><div class="btn_wrp"><div class="can_btn_pop">Cancel</div><div class="ok_btn_pop">OK</div></div></div></div>';
                 $('body').append(temp_pop);
                 $('.white_content').show();

                 $('.ok_btn_pop').off(event_type).on(event_type, function() {
                 $('.load_pop_d').hide();
                 _this.show_popup = false;
                 _this.current_pro_name = $(this).attr('data-project');
                 iWriter_controller.create_project($(this).attr('data-key'), $(this).attr('data-type'), $(this).attr('data-project'));
                 });
                 $('.can_btn_pop').off(event_type).on(event_type, function() {
                 $('.white_content').hide();
                 });
                 } else {
                 $('.load_pop_d').hide();
                 _this.show_popup = false;
                 _this.current_pro_name = $(this).attr('data-project');
                 iWriter_controller.create_project($(this).attr('data-key'), $(this).attr('data-type'), $(this).attr('data-project'));
                 }
                 });
                 }
                 },
                 error: function(jqXHR, textStatus, errorThrown)
                 {
                 //if fails
                 alert('Please try again');
                 }
                 }
                 );*/
                //end ajax
            } else {
                if ($('.prolist_load').html() != '') {
                    $('.load_pop_d').show();
                }

            }

        });
        //end load btn

        //save as
        $('.saveas_pro').mouseover(function (event) {
            if (event.target.className.split(" ")[0] == 'saveas_pro') {
                if (!$('.save_pop_2').is(':visible')) {
                    $('.save_pop_1').show();
                    $('.save_pop_2').hide();
                    $('.saveas_pop_d').show().css('right', '105%').css('top', '0px');
                    $('.err').text('');
                    $('.project_name').val('');
                }
            }
			// load_status = true;
        });
        //end save as
        $('.save_pro').mouseover(function (event) {
            if (event.target.className.split(" ")[0] == 'save_pro') {
                if (_this.save_type == 'create') {
                    $('.save_pop_1').show();
                    $('.save_pop_2').hide();
                    $('.save_pop_d').show().css('right', '105%').css('top', '0px');
                    $('.err').text('');
                }
            }
        });
        $('.tool_down_arrow_wrp li,.tool_wrapper li').mouseover(function () {
            if (!$(this).hasClass('save_pro')) {
                $('.save_pop_d').hide();
            }
            if (!$(this).hasClass('saveas_pro')) {
                $('.saveas_pop_d').hide();
            }
        });
        $('.can_btn,.ok_btn_common').off(event_type).on(event_type, function () {
            $('.saveas_pop_d').hide();
            $('.save_pop_d').hide();
			$('.white_content').remove();
            $('.project_name').val('');
            $('.err').text('');
        });

        $(window).off("keypress").on("keypress", function (e) {
            if (e.keyCode == 13 && $('.ok_btn').is(":visible") && $(".save_pop_1").is(":visible")) {
                $('.ok_btn').each(function () {
                    if ($(this).is(":visible")) {
                        $(this).click();
                    }
                });
                //$('.ok_btn').click();
            }

            if (e.keyCode == 13 && $('.ok_btn_common').is(":visible") && $(".save_pop_2").is(":visible")) {
                $('.ok_btn_common').each(function () {
                    if ($(this).is(":visible")) {
                        $(this).click();
                    }
                });
                //$('.ok_btn_common').click();
            }
        });

        $('.ok_btn').off(event_type).on(event_type, function () {

            if ($(this).hasClass('create_mode')) {
                _this.save_type = 'create';
            }

            var c_x_d = new create_xml_dom();
            var html_data = new Array();
            html_data[0] = new Array(); //notes
            html_data[1] = new Array(); //content
            $(".models_content div[contenteditable='true']").each(function () {
                if ($(this).hasClass('notes_content')) {
                    html_data[0].push($(this).html());
                }
                if ($(this).hasClass('content_contents')) {
                    html_data[1].push($(this).html());
                }

            });
            //get xml data
            var data_to_save = c_x_d.generate_xml_dom($(_this.project_xml_data[_this.current_key]['xml_data']).find('paragraphs'), html_data);
            if (!data_to_save) {

            } else {

                //var dataToStore = JSON.stringify({'data-key': _this.current_key, 'project_name': 'test_project', 'xml_data': _this.XMLToString(data_to_save[0])});

                if (_this.save_type == 'create') {
                    //create project
                    var project_name = '';
                    $(".project_name").each(function () {
                        if ($(this).is(":visible")) {
                            project_name = $(this).val();
                        }
                    });
                    if (project_name != '') {

                        var postData = {'data-key': _this.current_key, 'project_name': project_name, 'xml_data': _this.XMLToString(data_to_save[0]), 'jdate': new Date()};
                        //project_name = project_name.replace(/'/g, '"');
                        //postData['xml_data'] = postData['xml_data'].replace(/'/g, '"');

                        /*project_name = project_name.replace(/'/g, '&#39;');
                         postData['xml_data'] = postData['xml_data'].replace(/'/g, '&#39;');

                         project_name = project_name.replace(/"/g, '&#34;');
                         postData['xml_data'] = postData['xml_data'].replace(/"/g, '&#34;');*/

                        project_name = project_name.replace(/'/g, '#|#');
                        postData['xml_data'] = postData['xml_data'].replace(/'/g, '#|#');
                        project_name = project_name.replace(/"/g, '#||#');
                        postData['xml_data'] = postData['xml_data'].replace(/"/g, '#||#');
                        html5sql.process(
                                {
                                    sql: "SELECT * FROM iwriter_windows WHERE data_id = " + postData['data-key'] + " AND name = '" + project_name + "' AND language = '" + _this.lang + "'",
                                    success: function (transaction, results) {
                                        if (results.rows.length == 0) {
                                            html5sql.process(
                                                    {
                                                        sql: "INSERT INTO iwriter_windows (name, data_id, data, date_time, dtime,language) VALUES ('" + project_name + "'," + postData['data-key'] + ",'" + postData['xml_data'] + "'," + new Date().getTime() + ",'" + get_date() + "','" + _this.lang + "')",
                                                        success: function (transaction, results) {
                                                            //console.log(results.rowsAffected);
                                                            if (results.rowsAffected == 1) {
                                                                _this.save_type = 'save';
                                                                $('.save_pro').attr('data-project-name', project_name);
                                                                //alert('Project created successfully');
                                                                $('.save_pop_1').hide();
                                                                $('.save_pop_2').show();
                                                                $('.pop_msg_d').text(jsonData['new_project_created']);
                                                                $('.err').text('');
                                                                _this.show_popup = false;
                                                                _this.current_pro_name = project_name;
                                                            } else {
                                                                alert(jsonData['please_try_again']);
                                                            }
                                                        }
                                                    }
                                            );
                                        } else {
//                                           / postData['project_name'] = project_name;
                                            $('.err').text(jsonData['file_exist']);
                                        }
                                    }
                                }
                        );
                        /*var formURL = 'database.php?add';
                         $.ajax(
                         {
                         url: formURL,
                         type: "POST",
                         data: postData,
                         success: function(data, textStatus, jqXHR)
                         {
                         if (data == '1') {
                         _this.save_type = 'save';
                         $('.save_pro').attr('data-project-name', project_name);
                         //alert('Project created successfully');
                         $('.save_pop_1').hide();
                         $('.save_pop_2').show();
                         $('.pop_msg_d').text('New project created!');
                         $('.err').text('');
                         _this.show_popup = false;
                         _this.current_pro_name = project_name;
                         } else {
                         if (data == '00') {
                         $('.err').text('This file already exists. Do you want to replace it?');
                         } else {
                         alert('Please try again');
                         }
                         }
                         },
                         error: function(jqXHR, textStatus, errorThrown)
                         {
                         //if fails
                         alert('Please try again');
                         }
                         }
                         );*/
                    } else {
                        setTimeout(function () {
                            $('.err').text(jsonData['project_name']);
                        }, 400);
                    }
					load_status = true;
                } else {
                    //update project data
                    var postData = {'data-key': _this.current_key, 'project_name': $('.save_pro').attr('data-project-name'), 'xml_data': _this.XMLToString(data_to_save[0]), 'jdate': new Date()};
                    postData['xml_data'] = postData['xml_data'].replace(/'/g, '#|#');
                    postData['xml_data'] = postData['xml_data'].replace(/"/g, '#||#');
                    html5sql.process(
                            {
                                sql: "UPDATE iwriter_windows SET data = '" + postData['xml_data'] + "', date_time = " + new Date().getTime() + ", dtime = '" + get_date() + "' WHERE data_id = " + postData['data-key'] + " AND name ='" + postData['project_name'] + "'AND language = '" + _this.lang + "'",
                                success: function (transaction, results, rowArray) {
                                    if (results.rowsAffected == 1) {
                                        $('.save_pop_d').show().css('right', '105%').css('top', '0px');
                                        $('.save_pop_1').hide();
                                        $('.save_pop_2').show();

                                        $('.pop_msg_d').text(jsonData['update_success']);
                                        $('.err').text('');
                                        _this.show_popup = false;
                                        _this.current_pro_name = $('.save_pro').attr('data-project-name');
                                    } else {
                                        $('.save_pop_d').show().css('right', '105%').css('top', '0px');
                                        $('.save_pop_1').hide();
                                        $('.save_pop_2').show();
                                        $('.pop_msg_d').text(jsonData['please_try_again']);
                                        $('.err').text('');
                                    }
                                }
                            }
                    );
                    /*var formURL = 'database.php?update';
                     $.ajax(
                     {
                     url: formURL,
                     type: "POST",
                     data: postData,
                     success: function(data, textStatus, jqXHR)
                     {
                     if (data == '1') {
                     //alert('Project updated successfully');
                     $('.save_pop_d').show().css('right', '105%').css('top', '0px');
                     $('.save_pop_1').hide();
                     $('.save_pop_2').show();
                     $('.pop_msg_d').text('Project updated successfully');
                     $('.err').text('');

                     _this.show_popup = false;
                     _this.current_pro_name = $('.save_pro').attr('data-project-name');
                     } else {
                     //alert('Please try again');
                     $('.save_pop_d').show().css('right', '105%').css('top', '0px');
                     $('.save_pop_1').hide();
                     $('.save_pop_2').show();
                     $('.pop_msg_d').text('Please try again');
                     $('.err').text('');
                     }
                     },
                     error: function(jqXHR, textStatus, errorThrown)
                     {
                     //if fails
                     alert('Please try again');
                     }
                     }
                     );*/
                }
            }
            if ($('.err').text().indexOf(jsonData['file_exist']) != (-1)) {
                var temp_p = $(this).parents('.arrowp_wrp');
                var postData = {'data-key': _this.current_key, 'project_name': project_name, 'xml_data': _this.XMLToString(data_to_save[0]), 'jdate': new Date()};
                //var formURL = 'database.php?update_ex';

                console.log("UPDATE iwriter_windows SET date_time = " + new Date().getTime() + ", dtime = '" + get_date() + "' WHERE data_id = " + postData['data-key'] + " AND name ='" + postData['project_name'] + "' AND language = '" + _this.lang + "'");
                postData['xml_data'] = postData['xml_data'].replace(/'/g, '#|#');
                postData['xml_data'] = postData['xml_data'].replace(/"/g, '#||#');
                html5sql.process(
                        {
                            sql: "UPDATE iwriter_windows SET data = '" + postData['xml_data'] + "', date_time = " + new Date().getTime() + ", dtime = '" + get_date() + "' WHERE data_id = " + postData['data-key'] + " AND name ='" + postData['project_name'] + "' AND language = '" + _this.lang + "'",
                            success: function (transaction, results, rowArray) {
                                if (results.rowsAffected == 1) {
                                    temp_p.find('.save_pop_d').show().css('right', '105%').css('top', '0px');
                                    temp_p.find('.save_pop_1').hide();
                                    temp_p.find('.save_pop_2').show();

                                    temp_p.find('.pop_msg_d').text(jsonData['update_success']);
                                    temp_p.find('.err').text('');
                                    _this.save_type = 'save';
                                    $('.save_pro').attr('data-project-name', project_name);
                                    _this.show_popup = false;
                                    _this.current_pro_name = project_name;
                                } else {
                                    temp_p.find('.save_pop_d').show().css('right', '105%').css('top', '0px');
                                    temp_p.find('.save_pop_1').hide();
                                    temp_p.find('.save_pop_2').show();
                                    temp_p.find('.pop_msg_d').text(jsonData['please_try_again']);
                                    temp_p.find('.err').text('');
                                }
                            }
                        }
                );
                /*$.ajax(
                 {
                 url: formURL,
                 type: "POST",
                 data: postData,
                 success: function(data, textStatus, jqXHR)
                 {
                 if (data == '1') {
                 temp_p.find('.save_pop_d').show().css('right', '105%').css('top', '0px');
                 temp_p.find('.save_pop_1').hide();
                 temp_p.find('.save_pop_2').show();
                 temp_p.find('.pop_msg_d').text('Project updated successfully');
                 temp_p.find('.err').text('');
                 _this.save_type = 'save';
                 $('.save_pro').attr('data-project-name', project_name);
                 _this.show_popup = false;
                 _this.current_pro_name = project_name;
                 } else {
                 //alert('Please try again');
                 temp_p.find('.save_pop_d').show().css('right', '105%').css('top', '0px');
                 temp_p.find('.save_pop_1').hide();
                 temp_p.find('.save_pop_2').show();
                 temp_p.find('.pop_msg_d').text('Please try again');
                 temp_p.find('.err').text('');
                 }
                 },
                 error: function(jqXHR, textStatus, errorThrown)
                 {
                 //if fails
                 alert('Please try again');
                 }
                 }
                 );*/
            }
        });
        $('.save_pro_in').off(event_type).on(event_type, function () {
            if (_this.save_type != 'create') {
                $('.ok_btn').each(function () {
                    if (!$(this).hasClass('create_mode')) {
                        $(this).trigger(event_type);
                        return false;
                    }
                });
            }
        });
    };
    this.wordCount = function () {
        var val = '';
        var cnt = 0;
        var cnt_val = 0;
        if (_this.current_key == 12 || _this.current_key == 13 || _this.current_key == 14) {

            $('.content_contents').each(function (index) {

                var str = $(this).parents('.cont_wrp_box').find('.sturcture_content').first('p').text();
                var n = str.indexOf("Paragraph 1");
                if (n != (-1)) {
                    cnt_val = index - 1;
                }
            });
        }
        //console.log(cnt_val);
        $('.content_contents').each(function () {
            if (cnt > cnt_val) {
                if ($(this).text().trim() != '' && $(this).text().trim() != $(this).attr('data-ph')) {
                    //var str = $(this).html().trim();
                    var str = $(this).text().trim()
                    str = str.replace(/<br>/g, ' ');
                    str = str.replace(/<div>/g, ' ');
                    str = str.replace(/<\/div>/g, ' ');
                    var _str = str.split(' ');
                    for (var i = 0; i < _str.length; i++) {
                        val += _str[i];
                        val += ' ';
                    }
                    //val += $(this).text();
                    //val += ' ';
                }
            }
            cnt++;
        });
        val = val.trim();
        var words = 0;
        if (val.trim() != '') {
            words = val.replace(/\s+/gi, ' ').split(' ').length;
        }

        $('.word_count_text').text(jsonData['word_count'] + " " + words);
    };
    this.XMLToString = function (oXML) {

        var serializer = new XMLSerializer();
        var str = serializer.serializeToString(oXML);
        return str;
    };
    this.StringToXML = function (oString) {
        //code for IE
        if (window.ActiveXObject) {
            var oXML = new ActiveXObject("Microsoft.XMLDOM");
            oXML.loadXML(oString);
            return oXML;
        }
        // code for Chrome, Safari, Firefox, Opera, etc.
        else {
            return (new DOMParser()).parseFromString(oString, "text/xml");
        }
    };
    this.xmlToJson = function (xml) {

        // Create the return object
        var obj = {};
        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = _this.xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(_this.xmlToJson(item));
                }
            }
        }
        return obj;
    };
    this.reset_drop = function () {
        setTimeout(function () {
            $('.white_content').hide();
            $('.tool_down_arrow_wrp,.down_arrow_wrapper,.tool_wrapper').hide();
        });
    };
    this.writer_btns = function (element) {
        _this.reset_drop();
        if ($(element).hasClass('show_all')) {
            if ($(element).children('.tick_mark').hasClass('_selected')) {
                $('.str_common').each(function () {
                    $(this).children('.tick_mark').removeClass('_selected');
                });
            } else {
                $('.str_common').each(function () {
                    $(this).children('.tick_mark').addClass('_selected');
                });
            }
        } else {

            $('.show_structre:hidden').children('.tick_mark').addClass('_selected');
            $('.show_notes:hidden').children('.tick_mark').addClass('_selected');
            $('.show_content:hidden').children('.tick_mark').addClass('_selected');
            $('.show_all').children('.tick_mark').removeClass('_selected');
            if ($(element).children('.tick_mark').hasClass('_selected')) {
                $(element).children('.tick_mark').removeClass('_selected');
            } else {
                $(element).children('.tick_mark').addClass('_selected');
            }

            if ($('.show_structre').children('.tick_mark').hasClass('_selected') && $('.show_notes').children('.tick_mark').hasClass('_selected') && $('.show_content').children('.tick_mark').hasClass('_selected')) {
                $('.show_all').children('.tick_mark').addClass('_selected');
            }
        }

        $('.cont_wrp_box').show();
        _this.set_wheader();
        $('.sturcture_content,.content_contents,.notes_content').hide();
        if ($('.show_all').children('.tick_mark').hasClass('_selected')) {
            $('.sturcture_content,.content_contents,.notes_content').show();
        } else {
            if ($('.show_structre').children('.tick_mark').hasClass('_selected')) {
                $('.sturcture_content').show();
            }
            if ($('.show_content').children('.tick_mark').hasClass('_selected')) {
                $('.content_contents').show();
            }
            if ($('.show_notes').children('.tick_mark').hasClass('_selected')) {
                $('.notes_content').show();
            }
        }
        _this.wordCount();
    };
    this.set_wheader = function () {


        $('.cont_wrp_box').each(function () {
            if ($(this).html() == '') {
                $(this).remove();
            }
        });
        //need to load config xml
        var top_header_html = "";
        $(_this.project_xml_data[_this.current_key]['xml_data']).find('framework_intro').children('para').each(function () {
            if ($(this).text().indexOf("Diccionario") != (-1)) {
                var tempTxt = $(this).text().split("Diccionario");
                tempTxt[2] = tempTxt[0] + "<i>Diccionario " + tempTxt[1] + "</i>";
                top_header_html += '<p>' + tempTxt[2] + '</p>';
            } else {
                top_header_html += '<p>' + $(this).text() + '</p>';
            }

        });
        top_header_html += '<div class="word_count_text">' + jsonData['word_count'] + '</div>';
        $('.str_common:visible').each(function () {
            if (!$(this).children('.tick_mark').hasClass('_selected')) {
                var tempTxt = $(_this.config_msg).find('commentary_help').text();
                top_header_html = tempTxt;
                if (tempTxt.indexOf("Diccionario") != (-1)) {
                    tempTxt = tempTxt.split("Diccionario");
                    tempTxt[2] = tempTxt[0] + "<i>Diccionario " + tempTxt[1] + "</i>";
                    top_header_html = '<p>' + tempTxt[2] + '</p>';
                }
                //top_header_html = $(_this.config_msg).find('commentary_help').text();
            }
        });
        $('.models_header').html(top_header_html);
        var show_top_head = true;
        //$('.str_common:visible').each(function() {
        $('.str_common').each(function () {
            if ($(this).children('.tick_mark').hasClass('_selected')) {
                show_top_head = false;
            }
        });
        //console.log(show_top_head);

        if (show_top_head) {
            $('.models_header').empty();
            $('.cont_wrp_box').hide();
        }
        if ($(".show_content").find(".tick_mark").hasClass("_selected")) {
            if ($('.word_count_text').length == 0) {
                $('.models_header').append('<p></p><div class="word_count_text">' + jsonData['word_count'] + '</div>');
                _this.wordCount();
            }

        }
    };
    this.sendToSocket = function (_msg) {
        if (_msg != '') {
            var net = require('net');

            var HOST = '127.0.0.1';
            var PORT = 8888;

            var client = new net.Socket();

            client.connect(PORT, HOST, function () {
                //alert('CONNECTED TO: ' + HOST + ':' + PORT);
                // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
                client.write(_msg);
                client.destroy();
            });

            /*var formURL = 'socket.php';
             $.ajax(
             {
             url: formURL,
             type: "POST",
             data: {'msg': _msg},
             success: function(data, textStatus, jqXHR)
             {
             console.log(data);
             },
             error: function(jqXHR, textStatus, errorThrown)
             {
             //if fails
             alert('Please try again');
             }
             }
             );*/
        }
    };
    this.db_clk = function () {
        $('.models_page_body_right').unbind('dblclick').bind('dblclick', function () {
            return false; //disabled as requested by client
            var sel = (this.selection && this.selection.createRange().text) || (window.getSelection && window.getSelection().toString());
            sel = sel.trim();
            if (sel != '') {
                sel = sel.capitalizeFirstLetter();
                _this.sendToSocket(sel);
            }
        });
    };
}
String.prototype.capitalizeFirstLetter = function () {
    //return this.charAt(0).toUpperCase() + this.slice(1);
    return this.charAt(0).toString() + this.slice(1).toString();
}
function create_xml_dom() {

    this.generate_xml_dom = function (xml_data, html_dom_data) {

        var notes_cnt = 0;
        var content_cnt = 0;
        xml_data.find('paragraph').each(function () {
            if ($(this).find('name').length != 0) {
                if ($(this).find('notes').length != 0) {
                    $(this).find('notes').attr('data-val', html_dom_data[0][notes_cnt]);
                    //$(this).find('notes').empty();
                    notes_cnt++;
                }
                if ($(this).find('content').length != 0) {
                    $(this).find('content').attr('data-val', html_dom_data[1][content_cnt]);
                    //$(this).find('content').empty();
                    content_cnt++;
                }
            }
        });
        if (notes_cnt == 0 && content_cnt == 0) {
            return false;
        } else {
            return xml_data;
        }
    };


}

function handlepaste(elem, e) {
    var text = e.clipboardData.getData("text/plain");
    document.execCommand("removeFormat", false, text);
}
$(function () {
/*  function Menu(cutLabel, copyLabel, pasteLabel) {
        var gui = require('nw.gui')
                , menu = new gui.Menu()

                , cut = new gui.MenuItem({
                    label: cutLabel || "Cut"
                    , click: function () {
                        document.execCommand("cut");
                        iWriter_controller.wordCount();
                        console.log('Menu:', 'cutted to clipboard');
                    }
                })

                , copy = new gui.MenuItem({
                    label: copyLabel || "Copy"
                    , click: function () {
                        document.execCommand("copy");
                        console.log('Menu:', 'copied to clipboard');
                    }
                })

                , paste = new gui.MenuItem({
                    label: pasteLabel || "Paste"
                    , click: function () {
                        document.execCommand("paste");
                        iWriter_controller.wordCount();
                        console.log('Menu:', 'pasted to textarea');
                    }
                })
                ;

        menu.append(cut);
        menu.append(copy);
        menu.append(paste);

        return menu;
    } Disable Nwjs Function*/ 

    //var menu = new Menu(/* pass cut, copy, paste labels if you need i18n*/); Disable Nwjs Function
    $(document).on("contextmenu", function (e) {
        e.preventDefault();
        menu.popup(e.originalEvent.x, e.originalEvent.y);
    });
})