function get_date() {
    var _date = new Date();
	
	   if (iWriter_controller.lang == "cs") {
			var dd = _date.getDate();
			var mm = _date.getMonth() + 1; //January is 0!

			var yyyy = _date.getFullYear();
			if (dd < 10) {
				dd = '0' + dd
			}
			if (mm < 10) {
				mm = '0' + mm
			}
			var today = dd + '/' + mm + '/' + yyyy;
			_date = _date.toString();
			var _date_arr = _date.split(' ');
			today = today + ' ' + _date_arr[4];
			console.log(today);
			return today
		} else {
			_date = _date.toString();
			var _date_arr = _date.split(' ');
			console.log(_date_arr);
			return _date_arr[0] + ' ' + _date_arr[1] + ' ' + _date_arr[2] + ' ' + _date_arr[3] + ' ' + _date_arr[4];
		}
}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function isMacintosh() {
    return navigator.platform.indexOf('Mac') > -1
}

function isWindows() {
    return navigator.platform.indexOf('Win') > -1
}
var isWin = /^win/.test(process.platform);
var export_path = '';

if (isWindows()) {
    export_path = process.env.HOMEDRIVE + process.env.HOMEPATH + '/ispeaker/';
} else {
    if (isMacintosh()) {
        export_path = getUserHome() + '/iwriter/project/';
    } else {
        //path for linux
        export_path = process.env.HOME + '/iwriter/project/';
    }
}

var fs = require('fs');

fs.exists(export_path, function (exists) {
    if (exists) {
        // Do something
    } else {
        fs.mkdir(export_path, 0777, function (_err) {
            // path was created unless there was error
        });
    }
});

function escapeHtml(s) {
    if (!s) {
        return "";
    }
    s = s + "";
    return s.replace(/[\&"<>\\]/g, function(s) {
        switch (s) {
            case "&":
                return "&amp;";
            case "\\":
                return "\\\\";
            case '"':
                return '\"';
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            default:
                return s;
        }
    });
}

var gui = require('nw.gui');
var win = gui.Window.get();

var height="",width="";

$(document).ready(function() {
	height=parseInt(win.height);
	width=parseInt(win.width);
    set_max_height();
	
	$(window).resize(function() {
		height=parseInt(win.height);
		width=parseInt(win.width);
        set_max_height();
		var tempHeight = ($('.models_page_body_right').height() - $('.models_page_body_right .models_header').height() - 10);
		$('.models_content').css('height', tempHeight);
    });
	
	win.on("restore",function() {
		win.height = height;
		win.width = width;
	});
	
	if (localStorage.getItem("lang") == null) {
        console.log("heree");
        localStorage.setItem("lang", "cs");
        iWriter_controller.lang = localStorage.getItem("lang");
    }

    $(".language").off('change').on('change', function () {


        if (typeof (Storage) !== "undefined") {
            localStorage.setItem("lang", $(this).val());
        }


        $(this).attr('selected', 'selected');
        iWriter_controller.lang = localStorage.getItem("lang");
        location.href = location.href;

    });

	document.onkeydown = function (e) {  // This will disable CTRL+I
        e = e || window.event;//Get event
        if (e.ctrlKey) {
            var c = e.which || e.keyCode;//Get key code

            switch (c) {
                case 85:
                case 73://Block Ctrl+I --
                    return false;
                    e.preventDefault();
                    e.stopPropagation();
                    break;
            }
        }
    };
	
    if (!html5sql.database) {
        html5sql.openDatabase("MITR", "iSpeaker", 5 * 1024 * 1024);
    }
    html5sql.logInfo = true;
    html5sql.logErrors = true;


    /*html5sql.process(
     {
     sql: "DROP TABLE IF EXISTS projects;",
     success: function(transaction, results) {
     console.log(results);
     }
     }
     );*/


    //create table if not exist
    html5sql.process(
            {
                sql: "CREATE TABLE IF NOT EXISTS iwriter_windows (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(50), data_id INTEGER, date_time DATETIME, data TEXT, dtime varchar(50),language varchar(50));",
                success: function(transaction, results) {
                    html5sql.process(
                            {
                                sql: "SELECT * FROM iwriter_windows where language='" + iWriter_controller.lang +"';",
                                success: function(transaction, results, rowArray) {

                                }
                            }
                    );
                }
            }
    );

    $('.help_btn').off(event_type).on(event_type, function() {
        var OpenWindow = window.open("xml/" + iWriter_controller.lang + "/help.html", "Help Document", '');
    });

    //fetch all

    html5sql.process(
            {
                sql: "select * from iwriter_windows where language = '" + localStorage.lang + "' order by date_time DESC;",
                success: function(transaction, results, rowArray) {
                    if (results.rows.length == 0) {
                        $('.save_p_btn_txt').html('<span>' + jsonData["no_projects_saved"] + '</span><span class="up_home"></span>');
                    } else {
                        var temp_html = '';
                        for (var i in rowArray) {

                            var _name = rowArray[i]['name'].replace(/\#\|\#/g, "'");
                            _name = _name.replace(/\#\|\|\#/g, '"');

                            temp_html += '<div class="saved_projects_list" data-key="' + rowArray[i]['data_id'] + '" data-project="' + rowArray[i]['name'] + '" data-type="save">' + _name + '</div>';
                        }
                        temp_html += '<div class="saved_projects_list">&nbsp;</div>';


                        $('.save_p_btn_txt').html('<span>' + jsonData["my_saved_writing"] + '</span><span class="up_home"></span>');
                        $('.saved_projects').empty().html(temp_html);

                        $('.saved_projects').perfectScrollbar({suppressScrollY: false});
                        var _hgt = $('.saved_projects').height();
                        $('.saved_projects').attr("actHgt", _hgt).css("overflow", "hidden").css("height", _hgt + "px");
                        $('.saved_projects').height($('.save_p_btn').height());
                        var svd_pro_hgt = $('.saved_projects').height();

                        $('.save_p_btn').bind(event_type, function(e) {

                            e.preventDefault();
                            $('.saved_projects').stop();

                            if (Number(svd_pro_hgt) === 39 || Number(svd_pro_hgt) === 32)
                            {
                                $('.saved_projects').animate({height: $('.saved_projects').attr("actHgt")}, 500);
                            }
                            else
                            {
                                $('.saved_projects').animate({height: svd_pro_hgt}, 500);
                            }
                            if ($('.saved_projects').height() > $('.save_p_btn').height()) {
                                $('.saved_projects').animate({height: $('.save_p_btn').height()}, 500);
                            }
                        });

                        $('.saved_projects_list').off(event_type).on(event_type, function() {
							
							$('.lang_main').hide();
                            if ($(this).attr('data-type') == 'create') {
                                iWriter_controller.current_pro_name = '';
                            } else {
                                iWriter_controller.current_pro_name = $(this).attr('data-project');
                            }
                            iWriter_controller.create_project($(this).attr('data-key'), $(this).attr('data-type'), $(this).attr('data-project'));
                        });



                        var p_len = ($('.saved_projects_list').length) - 1;
                        $('.saved_projects_list:nth-child(' + p_len + ')').css('border-bottom', 'none');
                    }
                }
            }
    );


    /*var formURL = 'database.php?fetchall';
     $.ajax(
     {
     url: formURL,
     type: "GET",
     data: {},
     success: function(data, textStatus, jqXHR)
     {
     if (data == '0') {
     // no projects
     $('.save_p_btn_txt').html('<span>No projects saved</span><span class="up_home"></span>');
     } else {
     $('.save_p_btn_txt').html('<span>My saved writing</span><span class="up_home"></span>');
     $('.saved_projects').empty().html(data);

     $('.saved_projects').perfectScrollbar({suppressScrollY: false});
     var _hgt = $('.saved_projects').height();
     $('.saved_projects').attr("actHgt", _hgt).css("overflow", "hidden").css("height", _hgt + "px");
     $('.saved_projects').height($('.save_p_btn').height());
     var svd_pro_hgt = $('.saved_projects').height();

     $('.save_p_btn').bind(event_type, function(e) {

     e.preventDefault();
     $('.saved_projects').stop();

     if (Number(svd_pro_hgt) === 39 || Number(svd_pro_hgt) === 32)
     {
     $('.saved_projects').animate({height: $('.saved_projects').attr("actHgt")}, 500);
     }
     else
     {
     $('.saved_projects').animate({height: svd_pro_hgt}, 500);
     }
     if ($('.saved_projects').height() > $('.save_p_btn').height()) {
     $('.saved_projects').animate({height: $('.save_p_btn').height()}, 500);
     }
     });

     $('.saved_projects_list').off(event_type).on(event_type, function() {
     if ($(this).attr('data-type') == 'create') {
     iWriter_controller.current_pro_name = '';
     } else {
     iWriter_controller.current_pro_name = $(this).attr('data-project');
     }
     iWriter_controller.create_project($(this).attr('data-key'), $(this).attr('data-type'), $(this).attr('data-project'));
     });



     var p_len = ($('.saved_projects_list').length) - 1;
     $('.saved_projects_list:nth-child(' + p_len + ')').css('border-bottom', 'none');
     }
     },
     error: function(jqXHR, textStatus, errorThrown)
     {
     //if fails
     }
     }
     );*/

    $('.export_doc').off(event_type).on(event_type, function() {
        var doc_data = new Object();
        doc_data[0] = new Object();
        doc_data[1] = new Object();
        var cnt = 0;
        $('.content_contents').each(function(e) {
            if ($(this).text().trim() != $(this).attr('data-ph')) {
                doc_data[0][cnt] = $(this).html();
                doc_data[1][cnt] = $(this).attr('data-align');
                cnt++;
            }
        });

        if (doc_data.length != 0) {
            var _temp_arr = new Array();
            var _string = '';
            for (var i in doc_data[0]) {
                var _str = doc_data[0][i].replace(/\<br\>/g, "/ppp");
                _str = _str.replace(/\<div\>/g, "/ppp<div>");
                var temp_str = _str.split('/ppp<div>');
                for (var k in temp_str) {
                    _temp_arr.push(temp_str[k]);
                }
            }
            for (var i in _temp_arr) {
                if (_temp_arr[i] == '/ppp</div>') {
                    _temp_arr[i] = '\r\n';
                } else {
                    _temp_arr[i] = _temp_arr[i].replace(/\<\/div\>/g, "");
                    _temp_arr[i] += '\r\n';
                }
                _string += _temp_arr[i];
            }
            _string = _string.replace(/(<([^>]+)>)/ig, "");
            _string = _string.replace(/\&nbsp\;/g, " ");
            _string = _string.replace(/\/ppp/g, "");
            var fs = require('fs');
            saveTextAsFile();

            function saveTextAsFile()
            {
                var textToWrite = _string;//Your text input;
                var textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
                var fileNameToSaveAs = 'my_project';//Your filename;

				// Save file simple 
				var downloadLink = document.createElement("a");
                downloadLink.download = fileNameToSaveAs;
                downloadLink.innerHTML = "Download File";
                if (window.webkitURL != null)
                {
                    // Chrome allows the link to be clicked
                    // without actually adding it to the DOM.
                    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
                }
                else
                {
                    // Firefox requires the link to be added to the DOM
                    // before it can be clicked.
                    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                    downloadLink.onclick = destroyClickedElement;
                    downloadLink.style.display = "none";
                    document.body.appendChild(downloadLink);
                }

                downloadLink.click();
            }/*
             fs.writeFile("./www/project/my_project.txt", _string, function(err) {
             if (err) {
             alert("Please try again");
             } else {
             var uri = 'project/my_project.txt';
             var link = document.createElement("a");
             link.download = 'My project';
             link.href = uri;
             link.click();
             $(link).remove();
             $('.tool_down_arrow_wrp').hide();
             }
             });*/
        }
    });


    $('.main_wrapper').parent().css('background-color', '#e0f2fd').css('padding', '0');

    $('.models_page_body_right').click(function(e) {
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
        $('.tool_wrapper,.down_arrow_wrapper').hide();
    });

    $('.first_page .box').css('background', 'none repeat scroll 0 0 #ebba17');

    $(window).resize(function() {
        //set_max_height();
        if (Number($(window).width()) <= 480) {
            $('.second_page_top h1').text(jsonData["choose_a_model"]);
            $('.show_structure_panel').removeAttr('style').hide();
            $('.models_page_body').scrollTop(0);
        } else {
            $('.second_page_top h1').text(jsonData["choose_a_model"]);
            $('.left_wrapper').removeAttr('style').show();
            $('.show_structure_panel').removeAttr('style').show();
        }
    });
    $('.show_top').bind(event_type, function(e) {
        $('.left_wrapper').show();
        $('.show_structure_panel').removeAttr('style').hide();
    });
    $('.show_bottom').bind(event_type, function(e) {
        $('.show_structure_panel').show().css('min-height', '335px').css('margin-top', '0');
        $('.left_wrapper').hide();
    });
    $('.models_page_tools').bind(event_type, function(e) {
        e.preventDefault();
        $('.tool_wrapper').toggle();
        $('.down_arrow_wrapper').hide();
    });

    $('.models_page_home').bind(event_type, function(e) {
        e.preventDefault();
        //$('.common_page').hide();
        //$('.first_page,.home_help,.language_btn').show();
        //window.location.href = window.location.href;
        iWriter_controller.switchToHome();
    });

    $('.tool_down_arrow').bind(event_type, function(e) {
        e.preventDefault();
        if ($(e.target).hasClass('tool_down_arrow')) {
            //if (!$(this).find('.arrowp_wrp').is(':visible')) {
            $('.tool_down_arrow_wrp').toggle();
            //$('.arrowp_wrp').toggle();
            $('.load_pop_d').hide();
            //}
            $('.tool_wrapper,.down_arrow_wrapper').hide();


        }
        //alert('In');
    });
    $('.models_page_down_arrow,.down_arrow').bind(event_type, function(e) {
        e.preventDefault();
        if (!$('.arrowp_wrp').is(':visible')) {
            $('.down_arrow_wrapper').toggle();
        }
        $('.tool_down_arrow_wrp').hide();
        $('.tool_wrapper').hide();


    });

    $('.drp_home_clk').bind(event_type, function(e) {
        e.preventDefault();
        //$('.common_page').hide();
        //$('.first_page,.home_help,.language_btn').show();
        //window.location.href = window.location.href;
        //$('.tool_wrapper,.down_arrow_wrapper').hide();
        iWriter_controller.switchToHome();
    });

    $('.up_arrow').bind(event_type, function(e) {
        e.preventDefault();

        if (iWriter_controller.current_tool == 'writer') {

            iWriter_controller.switchFromWriter();

            //$('.fn_rigth').trigger(event_type);
        } else {
            $('.fn_left').trigger(event_type);
        }
    });

    $('.left_menu').bind(event_type, function(e) {

        if (!$('.second_page').is(':visible')) {
            e.preventDefault();
            $('.tool_wrapper,.down_arrow_wrapper').hide();
            var left_pos = $('.models_page_body_left').position();
            $('.models_page_body').scrollTop(0);
            $('.models_page_body_left').stop();
            if (Number(left_pos.left) == 0) {
                if ($(window).width() <= 480) {
                    $('.models_page_body_left').animate({'left': '-100%'});
                    $('.left_menu').css('background-position', '0px 0px');
                } else {
                    $('.models_page_body_left').animate({'left': '-100%'});
                    $('.left_menu').css('background-position', '0px 0px');
                }
                //$('.models_page_body,.second_page_body,.second_page_body_left,.models_page_body_left').css('overflow-y', 'scroll');
            } else {
                $('.models_page_body_left').animate({'left': '0'});
                //$('.models_page_body').css('overflow', 'hidden');
                $('.left_menu').css('background-position', '-5px 0px');
            }
        } else {
            e.preventDefault();
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
                $('.models_page_body,.second_page_body,.second_page_body_left,.models_page_body_left').css('overflow-y', 'scroll');
            } else {
                $('.second_page_body_left').animate({'left': '0'});
                $('.second_page_body').css('overflow', 'hidden');
                $('.left_menu').css('background-position', '-5px 0px');
            }
        }

    });



    $('.fn_left').bind(event_type, function(e) {
        e.preventDefault();
        $('.lang_main').hide();
        $('.common_page').hide();
        $('.second_page').show();
        $('.tool_wrapper,.down_arrow_wrapper').hide();

        iWriter_controller.leftPanelModel('li', '.second_page_body_left ul');

    });
    $('.fn_rigth').bind(event_type, function(e) {
        e.preventDefault();
        $('.lang_main').hide();
        $('.common_page').hide();
        $('.second_page').show();
        $('.tool_wrapper,.down_arrow_wrapper').hide();
        iWriter_controller.leftPanelWriter('li', '.second_page_body_left ul');
    });
    $('.left_wrapper li,.str_common').bind(event_type, function(e) {
        if (iWriter_controller.current_tool == 'model') {
            var left_pos = $('.models_page_body_left').position();

            if (Number(left_pos.left) == 0) {
                if ($(window).width() <= 480) {
                    $('.models_page_body_left').animate({'left': '-100%'});
                } else {
                    $('.models_page_body_left').animate({'left': '-100%'});
                }
            }
        }

        $('.tool_wrapper,.down_arrow_wrapper').hide();
    });

    $('.models_page_body_right').bind(event_type, function(e) {
        iWriter_controller.reset_drop();
    });
    set_max_height();
    function set_max_height() {
        var window_height = Number(($(window).height() * 10) / 100);
        var _margin = $('.inner_wrapper').outerHeight(true) - $('.inner_wrapper').height();
        window_height = $(window).height() - 50 - _margin;

        $('.models_page_body,.second_page_body,.second_page_body_left,.models_page_body_left,.models_page_body_right').css('min-height', window_height);
        var scroll_pos = $('.inner_wrapper').position();
        $(window).scrollTop(scroll_pos.top);
        $('.models_page_body').scrollTop(0);

        $('.inner_wrapper,.main_wrapper').css('min-height', '670px');
		
        //$('.models_page_body,.second_page_body,.second_page_body_left,.models_page_body_left,.models_page_body_right').css('overflow-y', 'auto');
        //$('.models_page_body,.second_page_body').css('overflow-y', 'auto');
        if (Number($(window).width()) <= 480) {
            $('.second_page_top h1').text('Choose a model');
            //$('.models_page_body').css('overflow', 'hidden');
        }
    }

}
);

var writer_content = new Object();
writer_content['argument_brainstorm'] = '<p><span>Brainstorm for ideas using whatever method suits you best:</span><br/><ul class="circle_li common_ul"><li>Mind maps</li><li>Lists of interesting concepts, facts, questions, etc.</li><li>Conversations with colleagues</li></ul></p>';
writer_content['argument_connecting_words'] = '<p><strong>Firstly</strong> (= I have several points to make)<br/><strong>Furthermore... In addition,...  Moreover,...</strong> (= I have another important point)<br/><strong>However,...</strong> (to introduce a counterargument)</br><strong>Thus,... Therefore,...</strong> (to introduce a conclusion)</p>';
writer_content['argument_formal'] = '<p><span>To make your writing more formal, consider these points:</span><br><span class="blueTxtCss">1. Word choice</span><br><span>It is usually best to use standard English words and phrases, that is, those with no label in the dictionary.</span><br><span>Avoid anything marked <i>informal</i>, <i>slang</i>, <i>offensive</i>, etc.</span><br><span>Some words and phrases are marked formal. Only use these if you are sure they are appropriate and you know how to use them.<br/>You may need to use the technical or specialist vocabulary of your subject or profession (e.g. investment portfolio, liquid nitrogen bath). When you read, note when and how this language is used. </span><br><span class="blueTxtCss">2. Short forms</span><br><span>Avoid contracted forms (e.g. haven&apos;t, he&apos;s, I&apos;m) and abbreviations (e.g. pls - please, ad - advertisement)</span><br><span class="blueTxtCss">3. Sentence structure</span><br><span>In formal writing you are likely to be expressing complex ideas. To do this you will need to write sentences using relative pronouns (e.g. which, that), subordinating conjunctions (e.g. although, because, if) and coordinating conjunctions (e.g. and, but, or). Very long sentences with many clauses can be difficult to understand. Aim for clarity rather than complexity.</span><br></p>';
writer_content['argument_formal_v3'] = '<p><span>To make your writing more formal, consider these points:</span><br><span class="blueTxtCss">1. Word choice</span><br><span>It is usually best to use standard English words and phrases, that is, those with no label in the dictionary.</span><br><span>Avoid anything marked <i>informal</i>, <i>slang</i>, <i>offensive</i>, etc.</span><br><span>Some words and phrases are marked formal. Only use these if you are sure they are appropriate and you know how to use them.<br/>You may need to use the technical or specialist vocabulary of your subject or profession (e.g. investment portfolio, liquid nitrogen bath). When you read, note when and how this language is used. </span><br><span class="blueTxtCss">2. Short forms</span><br><span>Avoid contracted forms (e.g. haven&apos;t, he&apos;s, I&apos;m) and abbreviations (e.g. pls - please, ad - advertisement)</span><br><span class="blueTxtCss">3. Sentence structure</span><br><span>In formal writing you are likely to be expressing complex ideas. To do this you will need to write sentences using relative pronouns (e.g. which, that), subordinating conjunctions (e.g. although, because, if) and coordinating conjunctions (e.g. and, but, or). Very long sentences with many clauses can be difficult to understand. Aim for clarity rather than complexity.</span><br></p>';
writer_content['argument_make_clear'] = '<p><span>If you use the words or ideas of another person in your academic writing, you must always say where these have come from.  If you do not, you might be accused of </span><span><strong>plagiarism</strong>  (= copying another person\'s ideas or words and pretending that they are yours).</span><br><span>It is usual to mention the author briefly in the essay and then at the end write a full reference in your </span><span><strong>bibliography</strong> (= an alphabetical list of all the books, magazines, websites and other sources you have magazines, websites and other sources you have consulted) or in your list of <strong>references. </strong> </span><br><span>Different institutions have different styles for this, so you should check with your tutor, college or university to see the method and punctuation you should use and be consistent. </span><br> </p>';

writer_content['argument_make_clear_v3'] = '<p><span>If you use the words or ideas of another person in your academic writing, you must always say where these have come from.  If you do not, you might be accused of </span><span><strong>plagiarism</strong>  (= copying another person\'s ideas or words and pretending that they are yours).</span><br><span>It is usual to mention the author briefly in the essay and then at the end write a full reference in your </span><span><strong>bibliography</strong> (= an alphabetical list of all the books, magazines, websites and other sources you have magazines, websites and other sources you have consulted) or in your list of <strong>references.</strong></span><br><span>Different institutions have different styles for this, so you should check with your tutor, college or university to see the method and punctuation you should use and be consistent.</span><br> </p>';

writer_content['argument_phrases'] = '<p><span class="blueTxtCss">Adjectives</span><br><span><strong>important, major, serious, significant</strong></span><br><span><i>An important point to consider is...</br>This was a highly significant discovery.</i></span><br><span class="blueTxtCss">Patterns with It + adjective</span><br><span><strong>clear, likely, possible, surprising, evident</strong></span><br><span><i>It is clear that the study of space is expensive.</i></span><br><span><strong>important, difficult, necessary, possible, interesting</strong></span><br><span><i>It is important to consider the practical effects of these measures.</i></span><br><span class="blueTxtCss">Adverbs and phrases</span><br><span><strong>clearly, indeed, in fact, of course, generally, usually, mainly, widely, perhaps, probably, certainly, possibly, rarely, sometimes, often</strong></span><br><span><i>Clearly, this is a serious issue that deserves further study.<br/>This book is generally held to be her greatest novel.</i></span><br></p>';
writer_content['argument_read_and_research'] = '<p><span>Research your topic and gather information from a variety of sources:</span><br><ul class="circle_li common_ul"><li> Books and journals</li><li>The media</li><li> Websites</li><li>Interviews or questionnaires</li><li>Scientific studies</li></ul></p>';

writer_content['argument_read_and_research_v1'] = '<p><span>Research your topic and gather information from a variety of sources:</span><br><ul class="circle_li common_ul"><li> Books and journals</li><li>The media</li><li> Websites</li><li>Interviews or questionnaires</li><li>Scientific studies</li></ul></p>';

writer_content['argument_use_connecting_words_v3'] = '<p><span><strong>Firstly </strong> (= I have several points to make)</span><br><span><strong>Furthermore... In addition,...  Moreover,...</strong> (= I have another important point)</span><br><span><strong>However,...</strong> (to introduce a counterargument)</span><br><span><strong>Thus,... Therefore,...</strong> (to introduce a conclusion)</span><br></p>';

writer_content['compare_words_differences'] = '<p><i><span>X... On the other hand, Y... / Y, on the other hand,... <br/>Unlike X, Y ...</span><br><span>X... In contrast, Y...</span><br><span>While X..., Y...</span><br><span>X..., while Y...</span><br><span>X... However, Y...</span><br><span>X... Y, however, ... </span><br><span>X differs from Y in terms of / with regard to...</span><br><span>X is different from / contrasts with Y in that...</span><br><span>X..., whereas Y...</span><br><span>X is slightly / a little / somewhat smaller than Y.</span><br><span>X is much / considerably smaller than Y.</span><br><span>X and Y are completely / totally / entirely / quite different.</span><br><span>X and Y are not quite / exactly / entirely the same.</span><br></i></p>';

writer_content['compare_words_similarities'] = '<p><i><span>X... Similarly, Y...</span><br><span>Both X and Y...</span><br><span>X... Y also...</span><br><span class="f_normal">Both + plural noun:</span><br><span>Both types of school...</span><br><span>Like X, Y...</span><br><span>Like state schools, private schools...</span><br><span>X and Y are similar in that they both...</span><br><span>X is similar to Y in terms of / with regard to...</span><br><span>X resembles Y in that they both...</span><br><span>X is the same as Y.</span><br><span>X is <span class="f_normal">almost / nearly / virtually / just / exactly /</span></span><br><span>precisely the same as Y.</span><br><span>X and Y are very / rather / quite  similar.</span><br></i></p>';

writer_content['cover_letter_appropriate'] = '<p><i><span>I am writing to apply for the post of...<br>Since graduating from..., I have...<br>I have considerable / extensive experience in (the field of)...<br/>I am committed to pursuing a career in...<br/>I consider / feel that my qualifications and work experience could / might be of interest to the company.<br/>If called for an interview, I would be available at any time convenient for you.<br/>Please find attached a copy of my curriculum vitae / r&#233;sum&#233; for your consideration.<br/>I look forward to hearing from you in due course.</span><br></i></p>';

writer_content['covering_letter_lay_your'] = '<p><ul class="circle_li common_ul"><li>Your address, but not your name, goes at the top on the right.</li><li>The name and address of the person you are writing to goes on the left.</li><li>If you do not know a name, use a position e.g. &apos;Customer Services Manager&apos;.</li><li>The date goes under either address, or above the address on the left.</li><li>Give some kind of reference or use a heading.</li></ul></p>';

writer_content['coverl_greeting_and_close'] = '<p><span class="blueTxtCss">British Style:</span><br><span><i>Dear Sir / Madam............Yours faithfully</span><br><span>Dear Ms Walker............Yours sincerely</i></span><br><span class="blueTxtCss">American Style:</span><br><span><i>To whom it may concern............Yours truly</span><br><span>Dear Ms. Walker............Sincerely / Sincerely yours</i></span><br></p>';

writer_content['cv_use_action_verbs'] = '<p><span class="blueTxtCss">Action verbs</span><br>Use action verbs to <span>describe your achievements and make them look more dynamic.</span><br><span><strong>Examples:</strong><i> achieved, administered, analyzed, advised, arranged, compiled, conducted, coordinated, created, designed, developed, devised, distributed, evaluated, examined, executed, implemented, increased, introduced, instructed, liaised, managed, mentored, monitored, negotiated, organized, oversaw prepared, recommended, reduced, researched, represented, solved, supervised, trained.</i></span><br><span class="blueTxtCss">Positive Adjectives</span><br><span>Use positive adjectives to describe yourself.</span><br><span><strong>Examples: </strong><i>active, adaptable, committed, competent, dynamic, effective, efficient, enthusiastic, experienced, flexible, (highly) motivated, organized, professional, proficient, qualified, successful.</i></span><br></p>';

writer_content['cv_use_appropriate'] = '<p><span class="blueTxtCss">Skills</span><br><span><i>Native French speaker<br>Near-native command of English<br>Good spoken and written German<br>Computer literate<br>Familiar with HTML<br>Experienced trainer and facilitator</span><br><span class="blueTxtCss f_normal">Education and experience</span><br><span><i>Baccalaur&#233;at s&#233;rie C (equivalent of A levels in Maths and Physics)<br/>The qualifications described below do not have exact equivalents in the British / American system.<br/>I enclose photocopies of my certificates with English translations.<br/>Four weeks&apos; work experience at a leading software house. <br/>Summer internship at a marketing firm.</i></span><br><span class="blueTxtCss f_normal">Personal Qualities</span><br><span><i>Team player<br>Work well as part of a team<br>Work well under pressure<br>Able to meet deadlines<br>Welcome new challenges<br>Can-do attitude </i></span><br></p>';

writer_content['datagraphs_ask_yourself'] = '<p><span>What is the information about?<br>What do the numbers on each axis represent?<br>What changes do the lines show?<br>How do the lines stand in relation to each other?<br>Which feature of the lines stands out most?<br>What conclusions can be drawn from the graph?</span><br></p>';

writer_content['datagraphs_developments'] = '<p><span><i>a <span class="f_normal">small / slight</span> / <span class="f_normal">gradual</span> increase / decrease<br>a <span class="f_normal">significant / marked / dramatic</span> increase / decrease<br>a <span class="f_normal">small / slight</span> rise / fall / dip<br>steady growth<br>to rise / increase / fall / decrease / decline / drop (by 5%)<br>to rise / fall <span class="f_normal">steadily / dramatically / sharply / rapidly</span><br>Customer numbers have fluctuated.<br>(Online sales) reached an all-time high / low.<br>The graph shows a marked change in...</span></p>';

writer_content['datagraphs_general_trends'] = '<p><span><i>The graph shows / represents / indicates...<br>The figures show / indicate (that)...<br>From the graph it can be seen that...<br>The following conclusions can be drawn from the data:<br>The main trend seen in the data is that...<br>The main trend is upwards / downwards.</i></span><br></p>';
writer_content['datapiecharts_differences'] = '<p><span><i>There were almost twice / three times / half as many... as...<br/>Far / slightly / 20% fewer X... than Y...<br/>Many / far / a few / 20% more X... than Y...<br/>A greater proportion of ... than of...<br/>20% of women..., while only 10% of men...<br/>80% of (adults send emails), compared to 34% (who prefer texts).</i></span></p>';

writer_content['datapiecharts_gen_features'] = '<p><span><i>The chart shows / represents / indicates...<br>The figures show / indicate (that)...<br>From the chart it can be seen that...<br>The following conclusions can be drawn from the data:</i></span></p>';

writer_content['datapiecharts_proportions'] = '<p><span><i>More / Less than half of the total...<br>Only a third / a quarter...<br>Just / slightly under / over 50%...<br> The biggest / smallest proportion / sector...<br>The vast majority of...<br>X and Y are <span class="f_normal">roughly / approximately</span> equal.<br>As many (people were learning French) as (Spanish).</i></span></p>';

writer_content['let_complaint_appropriate'] = '<p><span class="blueTxtCss">Introducing the topic</span><br><i>I am writing to complain about / to express my dissatisfaction with...<br/>The purpose of this letter is to express my disappointment with...</i><br><span class="blueTxtCss">Describing the problem</span><br>Strong adjectives: <i>appalled, distressed, disgusted, shocked</i><br>Less strong: </i><i>disappointed, dismayed, dissatisfied</i><br><span class="blueTxtCss">What do you want?</span><br>Definite:<i> a full / partial refund, a replacement, an apology</i><br>More flexible:<i> compensation, reimbursement, recompense</i><br><span class="blueTxtCss">Endings<br/></span><i>I look forward to your swift reply.<br>I look forward to hearing from you at your earliest convenience. <br/>I look forward to hearing from you without delay.<br/>I very much hope to hear from you shortly.<br>I await your prompt reply.</i></p>';

writer_content['letterenquiry_appropriate'] = '<p><span><i>It would also be helpful to know what / when, etc...<br>I would be interested to know...<br>I would be grateful if you could let me have...<br>Please let me know...<br>Please send me...<br>Would you send me details of...</i></span></p>';

writer_content['pres_practise_your_talk'] = '<p><span>The more you practise, the more confident you will feel and the better your talk will be.</span><ul class="circle_li common_ul"><li>First, practise your talk alone several times until you can speak fluently and confidently from your notes and keep to the time allowed.</li><li>Then practise with one or more friends listening. Is the talk clear? Is your voice loud and clear? Are you looking at the audience?</li><li>If you can, practise at least once with the equipment you will use and in the room where you will give the talk.</li><li>Remember to use your dictionary or dictionary CD-ROM to check the pronunciation of any words you are not sure about as well as vocabulary and grammar.</li></ul></p>';
writer_content['present_approp_begin_end'] = '<p><span class="blueTxtCss">Introduction</span><br><i>Good morning. My talk today examines...<br>The subject / title of my talk / paper is...</br>Hello. Today I&apos;m going to talk about / discuss / examine...</i><br><span class="blueTxtCss">Concluding</span><br><i>So, I have talked about...<br>To sum up / summarize:  in my presentation I have...<br>In conclusion, I believe it is clear that...<br>To conclude: the benefits / results I have described in my talk are important and therefore I consider that...</i></p>';

writer_content['present_approp_structure'] = '<p><span class="blueTxtCss">Explaining structure</span><br><i>In this talk I intend to outline...<br>In my talk I will discuss the main features of...<br>I am going to examine three benefits / advantages of...</i><br/><span class="blueTxtCss">Introducing each point</span><br><i>The first / second / next / last point / area...</br>I would like to discuss is...<br/>I want to begin by looking at...<br>I&apos;d now like to look at another / the second benefit of...</i><br><span class="blueTxtCss">Clarifying</span><br/><i>In other words...<br>That is to say...</i><br><span class="blueTxtCss">Changing the subject</span><br><i>So, I have discussed...<br>Now I&apos;d like to turn to...<br>Moving on to the next / second / last benefit...<br></i></p>';

writer_content['presentations_make_notes'] = '<p><ul class="circle_li common_ul"><li>Number your cards.</li><li>Note the number of the visual you will show.</li><li>Write out and highlight key words and phrases to guideyour audience through your talk.</li><li>Some people find it helpful to write out the whole introduction and conclusion.</li></ul></p>';

writer_content['presentations_prep_for_quest'] = '<p><span class="blueTxtCss">Answering difficult questions</span><br><i>I&apos;m sorry, I don&apos;t quite understand your question. Could you repeat it?<br/> Well, I&apos;m not sure about that, but I think...</i></p>';

writer_content['presentations_prep_vis_aid'] = '<p><ul class="circle_li common_ul"><li>If you use Powerpoint&#0153;, all text and charts, diagrams, etc. must be large and clear.</li><li> Do not put too much information on each  slide.</li><li> Leave lots of white space.</li><li> Use headings and bullets to show the relationship between ideas.</li><li> Use notes, not sentences.</li><li> If you use posters or pictures, check that the people at the back of the room will be able to see / read them.</li><li> Avoid writing / drawing things on a whiteboard during your talk.</li></ul></p>';

writer_content['reports_ask_yourself'] = '<p><span>You need to make the objective of the report clear so that people who are reading it know why they are reading. Thinking about the readers and what they need to know will help improve your report.</span><ul class="circle_li common_ul"><li>Is the purpose of the report clear throughout?</li><li> Can the readers find the information they need?</li><li> Will diagrams or tables make the information clearer?</li><li> Should I just present the facts or include recommendations as well?</li></ul></p>';

writer_content['reports_lang_to_give_conc'] = '<p><span class="blueTxtCss">Giving Conclusions</span><br><i>In conclusion...<br>The research shows / demonstrates that...<br>The research shows / demonstrates  <span class="f_normal">+ noun</span>  (e.g. the effect of...)<br>From the research / From the evidence we conclude that...</i><br><span class="blueTxtCss">Giving recommendations</span><br><i>We recommend that...<br>It is recommended that...<br>The best solution is / would be to... (e.g. adopt design A)<br>The best solution is / would be  <span class="f_normal">+ noun</span> (e.g. a reduction in office hours)<br>If we do A, we will see B.<br>This will have an impact on <span class="f_normal">+ noun</span> (e.g. costs / productivity / the business)</i></p>';
writer_content['reports_lang_to_outline'] = '<p><span class="blueTxtCss">Outlining research</span><br><i>We asked (two developers) to...<br>We conducted our research by... (asking a group of...)<br>We examined / looked at / researched... (the problem / the cost / several companies) <br/>We surveyed... (a total of 250 employees)<br>We compared A and B.<br>The group was made up of...</i><br><span class="blueTxtCss">Presenting findings</span><br><i>We found that, on the whole, ...<br>According to the majority of respondents...<br>Overall people preferred...<br>50% of those surveyed said (that)...<br></i></p>';
writer_content['reports_lang_to_state'] = '<p><i>The purpose / aim / objective of this report is to...</i><br/><i>This report aims to...</i></br><i>This report presents / gives information on...</i></p>';
writer_content['review_think_about'] = '<p style="margin:0;">Your review should try to answer the questions a reader might have:</br><span class="blueTxtCss">Fiction</span><ul class="circle_li common_ul"><li>What kind of book is it?</li><li>What happens in the story?</li><li>Who are the main characters?</li><li>What is the main theme of the book?</li><li>Is it well written?</li><li>Would you recommend this book?</li></ul><span class="blueTxtCss">Non-fiction</span><ul class="circle_li common_ul"><li>What is the author&apos;s reason for writing the book?</li><li>Is it well organized? Can you follow the argument easily and find the important  information?</li><li>Does the author support his / her findings well?</li><li>How does it compare to other books on the same subject?</li></ul></p>';
writer_content['review_use_begin_and_end'] = '<p><span class="blueTxtCss">Beginnings</span><br/><i>It is a fascinating tale of...<br/>This moving account of...<br/>I found this story far-fetched and unconvincing.</i><br/><span class="blueTxtCss">Giving your opinion</span><br/><i>The writer excels at...<br/>I was impressed by...<br/>One aspect I found a little disappointing was...<br/>One possible flaw is that...</i><br/><span class="blueTxtCss">Conclusions</span><br/><i>I would highly recommend this rewarding book.<br/>I thoroughly enjoyed this book. In fact I couldn&apos;t put it down!<br/>By the end of this book, you feel...<br/>I was left unmoved by this story.<br/>I would strongly advise against reading this book.</i></p>';
writer_content['review_use_describe_plot'] = '<p><span class="blueTxtCss">Details / plot</span><br/><i>Written in..., the story begins with...<br/>The events unfold in...<br/>The tale is set in...</i><br/><span class="blueTxtCss">Characters</span><br/><i>The writer introduces us to...<br/>The principal characters are...<br/>My favourite character is undoubtedly...<br/>The story focuses on...<br/>We experience all this through the eyes of...</i></p>';
