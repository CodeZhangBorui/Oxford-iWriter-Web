//
// officegen: All the code to generate PPTX/PPTS files.
//
// Please refer to README.md for this module's documentations.
//
// NOTE:
// - Before changing this code please refer to the hacking the code section on README.md.
//
// Copyright (c) 2013 Ziv Barber;
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// 'Software'), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

var baseobj = require("./basicgen.js");
var msdoc = require("./msofficegen.js");
var pptxShapes = require("./pptxshapes.js");
var pptxFields = require("./pptxfields.js");

var path = require('path');

var fast_image_size = require('fast-image-size');

if ( !String.prototype.encodeHTML ) {
	String.prototype.encodeHTML = function () {
		return this.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	};
}

///
/// @brief Extend officegen object with PPTX/PPSX support.
///
/// This method extending the given officegen object to create PPTX/PPSX document.
///
/// @param[in] genobj The object to extend.
/// @param[in] new_type The type of object to create.
/// @param[in] options The object's options.
/// @param[in] gen_private Access to the internals of this object.
/// @param[in] type_info Additional information about this type.
///
function makePptx ( genobj, new_type, options, gen_private, type_info ) {
	///
	/// @brief Convert shape name to shape information.
	///
	/// This method convert the shape information reseived from the user to the real shape information object.
	///
	/// @param[in] shapeName Either the name of the shape or the shape information.
	/// @return Information about this shape.
	///
	
	var pptWidth = 9144000;
	var pptType = 'screen4x3';

	function getShapeInfo ( shapeName ) {
		if ( !shapeName ) {
			return pptxShapes.RECTANGLE;
		} // Endif.

		if ( (typeof shapeName == 'object') && shapeName.name && shapeName.displayName && shapeName.avLst ) {
			return shapeName;
		} // Endif.

		if ( pptxShapes[shapeName] ) {
			return pptxShapes[shapeName];
		} // Endif.

		for ( var shapeIntName in pptxShapes ) {
			if ( pptxShapes[shapeIntName].name == shapeName ) {
				return pptxShapes[shapeIntName];
			} // Endif.

			if ( pptxShapes[shapeIntName].displayName == shapeName ) {
				return pptxShapes[shapeIntName];
			} // Endif.
		} // End of for loop.

		return pptxShapes.RECTANGLE;
	}

	genobj.shapes = pptxShapes;
	genobj.fields = pptxFields;

	///
	/// @brief Prepare everything to generate PPTX files.
	///
	/// This method checking for extra resources needed to add by the generator engine.
	///
	function cbPreparePptxToGenerate () {
		genobj.generate_data = {};

		// BMK_TODO:
	}

	///
	/// @brief Create the 'presProps.xml' resource.
	///
	/// ???.
	///
	/// @param[in] data Ignored by this callback function.
	/// @return Text string.
	///
	function cbMakePptxPresProps ( data ) {
		return gen_private.plugs.type.msoffice.cbMakeMsOfficeBasicXml ( data ) + '<p:presentationPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>';
	}

	///
	/// @brief Create the 'tableStyles.xml' resource.
	///
	/// ???.
	///
	/// @param[in] data Ignored by this callback function.
	/// @return Text string.
	///
	function cbMakePptxStyles ( data ) {
		return gen_private.plugs.type.msoffice.cbMakeMsOfficeBasicXml ( data ) + '<a:tblStyleLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>';
	}

	///
	/// @brief Create the 'viewProps.xml' resource.
	///
	/// ???.
	///
	/// @param[in] data Ignored by this callback function.
	/// @return Text string.
	///
	function cbMakePptxViewProps ( data ) {
		return gen_private.plugs.type.msoffice.cbMakeMsOfficeBasicXml ( data ) + '<p:viewPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:normalViewPr><p:restoredLeft sz="15620"/><p:restoredTop sz="94660"/></p:normalViewPr><p:slideViewPr><p:cSldViewPr><p:cViewPr varScale="1"><p:scale><a:sx n="64" d="100"/><a:sy n="64" d="100"/></p:scale><p:origin x="-1392" y="-96"/></p:cViewPr><p:guideLst><p:guide orient="horz" pos="2160"/><p:guide pos="2880"/></p:guideLst></p:cSldViewPr></p:slideViewPr><p:notesTextViewPr><p:cViewPr><p:scale><a:sx n="100" d="100"/><a:sy n="100" d="100"/></p:scale><p:origin x="0" y="0"/></p:cViewPr></p:notesTextViewPr><p:gridSpacing cx="78028800" cy="78028800"/></p:viewPr>';
	}

	///
	/// @brief Create the 'slideLayout1.xml' resource.
	///
	/// ???.
	///
	/// @param[in] data Ignored by this callback function.
	/// @return Text string.
	///
	function cbMakePptxLayout ( data ) {
		return gen_private.plugs.type.msoffice.cbMakeMsOfficeBasicXml ( data ) + '<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="title" preserve="1"><p:cSld name="Title Slide"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr><p:sp><p:nvSpPr><p:cNvPr id="2" name="Title 1"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="ctrTitle"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="685800" y="2130425"/><a:ext cx="7772400" cy="1470025"/></a:xfrm></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" smtClean="0"/><a:t>Click to edit Master title style</a:t></a:r><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id="3" name="Subtitle 2"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="subTitle" idx="1"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="1371600" y="3886200"/><a:ext cx="6400800" cy="1752600"/></a:xfrm></p:spPr><p:txBody><a:bodyPr/><a:lstStyle><a:lvl1pPr marL="0" indent="0" algn="ctr"><a:buNone/><a:defRPr><a:solidFill><a:schemeClr val="tx1"><a:tint val="75000"/></a:schemeClr></a:solidFill></a:defRPr></a:lvl1pPr><a:lvl2pPr marL="457200" indent="0" algn="ctr"><a:buNone/><a:defRPr><a:solidFill><a:schemeClr val="tx1"><a:tint val="75000"/></a:schemeClr></a:solidFill></a:defRPr></a:lvl2pPr><a:lvl3pPr marL="914400" indent="0" algn="ctr"><a:buNone/><a:defRPr><a:solidFill><a:schemeClr val="tx1"><a:tint val="75000"/></a:schemeClr></a:solidFill></a:defRPr></a:lvl3pPr><a:lvl4pPr marL="1371600" indent="0" algn="ctr"><a:buNone/><a:defRPr><a:solidFill><a:schemeClr val="tx1"><a:tint val="75000"/></a:schemeClr></a:solidFill></a:defRPr></a:lvl4pPr><a:lvl5pPr marL="1828800" indent="0" algn="ctr"><a:buNone/><a:defRPr><a:solidFill><a:schemeClr val="tx1"><a:tint val="75000"/></a:schemeClr></a:solidFill></a:defRPr></a:lvl5pPr><a:lvl6pPr marL="2286000" indent="0" algn="ctr"><a:buNone/><a:defRPr><a:solidFill><a:schemeClr val="tx1"><a:tint val="75000"/></a:schemeClr></a:solidFill></a:defRPr></a:lvl6pPr><a:lvl7pPr marL="2743200" indent="0" algn="ctr"><a:buNone/><a:defRPr><a:solidFill><a:schemeClr val="tx1"><a:tint val="75000"/></a:schemeClr></a:solidFill></a:defRPr></a:lvl7pPr><a:lvl8pPr marL="3200400" indent="0" algn="ctr"><a:buNone/><a:defRPr><a:solidFill><a:schemeClr val="tx1"><a:tint val="75000"/></a:schemeClr></a:solidFill></a:defRPr></a:lvl8pPr><a:lvl9pPr marL="3657600" indent="0" algn="ctr"><a:buNone/><a:defRPr><a:solidFill><a:schemeClr val="tx1"><a:tint val="75000"/></a:schemeClr></a:solidFill></a:defRPr></a:lvl9pPr></a:lstStyle><a:p><a:r><a:rPr lang="en-US" smtClean="0"/><a:t>Click to edit Master subtitle style</a:t></a:r><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id="4" name="Date Placeholder 3"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="dt" sz="half" idx="10"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:fld id="{F8166F1F-CE9B-4651-A6AA-CD717754106B}" type="datetimeFigureOut"><a:rPr lang="en-US" smtClean="0"/><a:t>6/13/2013</a:t></a:fld><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id="5" name="Footer Placeholder 4"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="ftr" sz="quarter" idx="11"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id="6" name="Slide Number Placeholder 5"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldNum" sz="quarter" idx="12"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:fld id="{F7021451-1387-4CA6-816F-3879F97B5CBC}" type="slidenum"><a:rPr lang="en-US" smtClean="0"/><a:t>?#?</a:t></a:fld><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>';
	}

	///
	/// @brief Create the main presentation resource.
	///
	/// This resource is the main resource of any PowerPoint document.
	///
	/// @param[in] data Ignored by this callback function.
	/// @return Text string.
	///
	function cbMakePptxPresentation ( data ) {

		var outString = gen_private.plugs.type.msoffice.cbMakeMsOfficeBasicXml ( data ) + '<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" saveSubsetFonts="1"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>';

		for ( var i = 0, total_size = gen_private.pages.length; i < total_size; i++ ) {
			outString += '<p:sldId id="' + (i + 256) + '" r:id="rId' + (i + 2) + '"/>';
		} // End of for loop.

		outString += '</p:sldIdLst><p:sldSz cx="' + pptWidth + '" cy="6858000" type="' + pptType + '"/><p:notesSz cx="6858000" cy="9144000"/><p:defaultTextStyle><a:defPPr><a:defRPr lang="en-US"/></a:defPPr>';

		var curPos = 0;
		for ( var i = 1; i < 10; i++ )
		{
			outString += '<a:lvl' + i + 'pPr marL="' + curPos + '" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl' + i + 'pPr>';
			curPos += 457200;
		} // End of for loop.

		outString += '</p:defaultTextStyle></p:presentation>';
		return outString;
	}

	///
	/// @brief Create the slides masters resource.
	///
	/// ???.
	///
	/// @param[in] data Ignored by this callback function.
	/// @return Text string.
	///
	function cbMakePptxSlideMasters ( data ) {
		return gen_private.plugs.type.msoffice.cbMakeMsOfficeBasicXml ( data ) + '<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr><p:sp><p:nvSpPr><p:cNvPr id="2" name="Title Placeholder 1"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="457200" y="274638"/><a:ext cx="8229600" cy="1143000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="ctr"><a:normAutofit/></a:bodyPr><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" smtClean="0"/><a:t>Click to edit Master title style</a:t></a:r><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id="3" name="Text Placeholder 2"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="457200" y="1600200"/><a:ext cx="8229600" cy="4525963"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0"><a:normAutofit/></a:bodyPr><a:lstStyle/><a:p><a:pPr lvl="0"/><a:r><a:rPr lang="en-US" smtClean="0"/><a:t>Click to edit Master text styles</a:t></a:r></a:p><a:p><a:pPr lvl="1"/><a:r><a:rPr lang="en-US" smtClean="0"/><a:t>Second level</a:t></a:r></a:p><a:p><a:pPr lvl="2"/><a:r><a:rPr lang="en-US" smtClean="0"/><a:t>Third level</a:t></a:r></a:p><a:p><a:pPr lvl="3"/><a:r><a:rPr lang="en-US" smtClean="0"/><a:t>Fourth level</a:t></a:r></a:p><a:p><a:pPr lvl="4"/><a:r><a:rPr lang="en-US" smtClean="0"/><a:t>Fifth level</a:t></a:r><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id="4" name="Date Placeholder 3"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="dt" sz="half" idx="2"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="457200" y="6356350"/><a:ext cx="2133600" cy="365125"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="ctr"/><a:lstStyle><a:lvl1pPr algn="l"><a:defRPr sz="1200"><a:solidFill><a:schemeClr val="tx1"><a:tint val="75000"/></a:schemeClr></a:solidFill></a:defRPr></a:lvl1pPr></a:lstStyle><a:p><a:fld id="{F8166F1F-CE9B-4651-A6AA-CD717754106B}" type="datetimeFigureOut"><a:rPr lang="en-US" smtClean="0"/><a:t>6/13/2013</a:t></a:fld><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id="5" name="Footer Placeholder 4"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="ftr" sz="quarter" idx="3"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="3124200" y="6356350"/><a:ext cx="2895600" cy="365125"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="ctr"/><a:lstStyle><a:lvl1pPr algn="ctr"><a:defRPr sz="1200"><a:solidFill><a:schemeClr val="tx1"><a:tint val="75000"/></a:schemeClr></a:solidFill></a:defRPr></a:lvl1pPr></a:lstStyle><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id="6" name="Slide Number Placeholder 5"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldNum" sz="quarter" idx="4"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="6553200" y="6356350"/><a:ext cx="2133600" cy="365125"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="ctr"/><a:lstStyle><a:lvl1pPr algn="r"><a:defRPr sz="1200"><a:solidFill><a:schemeClr val="tx1"><a:tint val="75000"/></a:schemeClr></a:solidFill></a:defRPr></a:lvl1pPr></a:lstStyle><a:p><a:fld id="{F7021451-1387-4CA6-816F-3879F97B5CBC}" type="slidenum"><a:rPr lang="en-US" smtClean="0"/><a:t>?#?</a:t></a:fld><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle><a:lvl1pPr algn="ctr" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="0"/></a:spcBef><a:buNone/><a:defRPr sz="4400" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mj-lt"/><a:ea typeface="+mj-ea"/><a:cs typeface="+mj-cs"/></a:defRPr></a:lvl1pPr></p:titleStyle><p:bodyStyle><a:lvl1pPr marL="342900" indent="-342900" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="?"/><a:defRPr sz="3200" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl1pPr><a:lvl2pPr marL="742950" indent="-285750" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="?"/><a:defRPr sz="2800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl2pPr><a:lvl3pPr marL="1143000" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="?"/><a:defRPr sz="2400" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl3pPr><a:lvl4pPr marL="1600200" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="?"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl4pPr><a:lvl5pPr marL="2057400" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="?"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl5pPr><a:lvl6pPr marL="2514600" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="?"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl6pPr><a:lvl7pPr marL="2971800" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="?"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl7pPr><a:lvl8pPr marL="3429000" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="?"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl8pPr><a:lvl9pPr marL="3886200" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="?"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl9pPr></p:bodyStyle><p:otherStyle><a:defPPr><a:defRPr lang="en-US"/></a:defPPr><a:lvl1pPr marL="0" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl1pPr><a:lvl2pPr marL="457200" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl2pPr><a:lvl3pPr marL="914400" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl3pPr><a:lvl4pPr marL="1371600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl4pPr><a:lvl5pPr marL="1828800" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl5pPr><a:lvl6pPr marL="2286000" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl6pPr><a:lvl7pPr marL="2743200" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl7pPr><a:lvl8pPr marL="3200400" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl8pPr><a:lvl9pPr marL="3657600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl9pPr></p:otherStyle></p:txStyles></p:sldMaster>';
	}

	///
	/// @brief Generate the XML code to describe colors.
	///
	/// ???.
	///
	/// @param[in] color_info Foreground color information.
	/// @param[in] back_info Background color information.
	///
	function cMakePptxColorSelection ( color_info, back_info )
	{
		var outText = '';
		var colorVal;
		var fillType = 'solid';
		var internalElements = '';

		if ( back_info ) {
			outText += '<p:bg><p:bgPr>';

			outText += cMakePptxColorSelection ( back_info, false );

			outText += '<a:effectLst/>';
			// BMK_TODO: (add support for effects)
			
			outText += '</p:bgPr></p:bg>';
		} // Endif.

		if ( color_info ) {
			if ( typeof color_info == 'string' ) {
				colorVal = color_info;

			} else {
				if ( color_info.type ) {
					fillType = color_info.type;
				} // Endif.

				if ( color_info.color ) {
					colorVal = color_info.color;
				} // Endif.

				if ( color_info.alpha ) {
					internalElements += '<a:alpha val="' + (100 - color_info.alpha) + '000"/>';
				} // Endif.
			} // Endif.

			switch ( fillType )
			{
				case 'solid':
					outText += '<a:solidFill><a:srgbClr val="' + colorVal + '">' + internalElements + '</a:srgbClr></a:solidFill>';
					break;
			} // End of switch.
		} // Endif.

		return outText;
	}

	///
	/// @brief Translate field_name into the text real value.
	///
	/// This method creating the text to display for the given field.
	///
	/// @param[in] field_name the name of the field.
	/// @param[in] slide_num current slide number.
	/// @return The text string data.
	///
	function CreateFieldText ( field_name, slide_num ) {
		var curDateTime = new Date ();
		var dayInWeek = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
		var monthsList = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		var monthsShortList = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
		var outValue = '';

		// curDateTime.getDate () 	Returns the day of the month (from 1-31)
		// curDateTime.getDay () 	Returns the day of the week (from 0-6)
		// curDateTime.getFullYear () 	Returns the year (four digits)
		// curDateTime.getHours () 	Returns the hour (from 0-23)
		// curDateTime.getMinutes () 	Returns the minutes (from 0-59)
		// curDateTime.getMonth () 	Returns the month (from 0-11)
		// curDateTime.getSeconds () 	Returns the seconds (from 0-59)
	
		switch ( field_name ) {
			// presentation slide number:
			case 'SLIDE_NUM':
			case 'slidenum':
				outValue += slide_num;
				break;

			// default date time format for the rendering application:
			case 'DATE_TIME':
			case 'datetime':
				outValue += curDateTime.getMonth () + '/' + curDateTime.getDate () + '/' + curDateTime.getFullYear ();
				break;

			// MM/DD/YYYY date time format (Example: 10/12/2007):
			case 'DATE_MM_DD_YYYY':
			case 'datetime1':
				outValue += curDateTime.getMonth () + '/' + curDateTime.getDate () + '/' + curDateTime.getFullYear ();
				break;

			// Day, Month DD, YYYY date time format (Example: Friday, October 12, 2007):
			case 'DATE_WD_MN_DD_YYYY':
			case 'datetime2':
				outValue += dayInWeek[curDateTime.getDay ()] + ', ' + monthsList[curDateTime.getMonth ()] + ' ' + curDateTime.getDate () + ', ' + curDateTime.getFullYear ();
				break;

			// DD Month YYYY date time format (Example: 12 October 2007):
			case 'DATE_DD_MN_YYYY':
			case 'datetime3':
				outValue += curDateTime.getDate () + ' ' + monthsList[curDateTime.getMonth ()] + ' ' + curDateTime.getFullYear ();
				break;

			// Month DD, YYYY date time format (Example: October 12, 2007):
			case 'DATE_MN_DD_YYYY':
			case 'datetime4':
				outValue += monthsList[curDateTime.getMonth ()] + ' ' + curDateTime.getDate () + ', ' + curDateTime.getFullYear ();
				break;

			// DD-Mon-YY date time format (Example: 12-Oct-07):
			case 'DATE_DD_SMN_YY':
			case 'datetime5':
				outValue += curDateTime.getDate () + '-' + monthsShortList[curDateTime.getMonth ()] + '-' + (curDateTime.getFullYear () % 100);
				break;

			// Month YY date time format (Example: October 07):
			case 'DATE_MM_YY':
			case 'datetime6':
				outValue += monthsList[curDateTime.getMonth ()] + ' ' + (curDateTime.getFullYear () % 100);
				break;

			// Mon-YY date time format (Example: Oct-07):
			case 'DATE_SMN_YY':
			case 'datetime7':
				outValue += monthsShortList[curDateTime.getMonth ()] + '-' + (curDateTime.getFullYear () % 100);
				break;

			// MM/DD/YYYY hh:mm AM/PM date time format (Example: 10/12/2007 4:28 PM):
			case 'DATE_TIME_DD_MM_YYYY_HH_MM_PM':
			case 'datetime8':
				outValue += curDateTime.getMonth () + '/' + curDateTime.getDate () + '/' + curDateTime.getFullYear ();
				outValue += (curDateTime.getHours () % 12) + ':' + curDateTime.getMinutes ();
				outValue += (curDateTime.getHours () > 11) ? ' PM' : ' AM';
				break;

			// MM/DD/YYYY hh:mm:ss AM/PM date time format (Example: 10/12/2007 4:28:34 PM):
			case 'DATE_TIME_DD_MM_YYYY_HH_MM_SC_PM':
			case 'datetime9':
				outValue += curDateTime.getMonth () + '/' + curDateTime.getDate () + '/' + curDateTime.getFullYear ();
				outValue += (curDateTime.getHours () % 12) + ':' + curDateTime.getMinutes () + ':' + curDateTime.getSeconds ();
				outValue += (curDateTime.getHours () > 11) ? ' PM' : ' AM';
				break;

			// hh:mm date time format (Example: 16:28):
			case 'TIME_HH_MM':
			case 'datetime10':
				outValue += curDateTime.getHours () + ':' + curDateTime.getMinutes ();
				break;

			// hh:mm:ss date time format (Example: 16:28:34):
			case 'TIME_HH_MM_SC':
			case 'datetime11':
				outValue += curDateTime.getHours () + ':' + curDateTime.getMinutes () + ':' + curDateTime.getSeconds ();
				break;

			// hh:mm AM/PM date time format (Example: 4:28 PM):
			case 'TIME_HH_MM_PM':
			case 'datetime12':
				outValue += (curDateTime.getHours () % 12) + ':' + curDateTime.getMinutes ();
				outValue += (curDateTime.getHours () > 11) ? ' PM' : ' AM';
				break;

			// hh:mm:ss: AM/PM date time format (Example: 4:28:34 PM):
			case 'TIME_HH_MM_SC_PM':
			case 'datetime13':
				outValue += (curDateTime.getHours () % 12) + ':' + curDateTime.getMinutes () + ':' + curDateTime.getSeconds ();
				outValue += (curDateTime.getHours () > 11) ? ' PM' : ' AM';
				break;

			default:
				return null;
		} // End of switch.

		return outValue;
	}

	///
	/// @brief ???.
	///
	/// ???.
	///
	/// @param[in] text_info Information how to display the text.
	/// @param[in] slide_obj The object of this slider.
	/// @return Text string.
	///
	function cMakePptxOutTextData ( text_info, slide_obj ) {
		var out_obj = {};

		out_obj.font_size = '';
		out_obj.bold = '';
		out_obj.underline = '';
		out_obj.rpr_info = '';

		if ( typeof text_info == 'object' )
		{
			if ( text_info.bold ) {
				out_obj.bold = ' b="1"';
			} // Endif.

			if ( text_info.underline ) {
				out_obj.underline = ' u="sng"';
			} // Endif.

			if ( text_info.font_size ) {
				out_obj.font_size = ' sz="' + text_info.font_size + '00"';
			} // Endif.

			if ( text_info.color ) {
				out_obj.rpr_info += cMakePptxColorSelection ( text_info.color );

			} else if ( slide_obj && slide_obj.color )
			{
				out_obj.rpr_info += cMakePptxColorSelection ( slide_obj.color );
			} // Endif.

			if ( text_info.font_face ) {
				out_obj.rpr_info += '<a:latin typeface="' + text_info.font_face + '" pitchFamily="34" charset="0"/><a:cs typeface="' + text_info.font_face + '" pitchFamily="34" charset="0"/>';
			} // Endif.

		} else {
			if ( slide_obj && slide_obj.color )
			{
				out_obj.rpr_info += cMakePptxColorSelection ( slide_obj.color );
			} // Endif.
		} // Endif.

		if ( out_obj.rpr_info != '' )
			out_obj.rpr_info += '</a:rPr>';

		return out_obj;
	}

	///
	/// @brief Create a text object for adding into a slide.
	///
	/// ???.
	///
	/// @param[in] text_info Information how to display the text.
	/// @param[in] text_string The text string or requested field.
	/// @param[in] slide_obj The object of this slider.
	/// @param[in] slide_num Current slide number.
	/// @return The PPTX code.
	///
	function cMakePptxOutTextCommand ( text_info, text_string, slide_obj, slide_num ) {
		var area_opt_data = cMakePptxOutTextData ( text_info, slide_obj );
		var parsedText;
		var startInfo = '<a:rPr lang="en-US"' + area_opt_data.font_size + area_opt_data.bold + area_opt_data.underline + ' dirty="0" smtClean="0"' + (area_opt_data.rpr_info != '' ? ('>' + area_opt_data.rpr_info) : '/>') + '<a:t>';
		var endTag = '</a:r>';
		var outData = '<a:r>' + startInfo;

		if ( text_string.field ) {
			endTag = '</a:fld>';
			var outTextField = pptxFields[text_string.field];
			if ( outTextField === null ) {
				for ( var fieldIntName in pptxFields ) {
					if ( pptxFields[fieldIntName] === text_string.field ) {
						outTextField = text_string.field;
						break;
					} // Endif.
				} // End of for loop.

				if ( outTextField === null ) {
					outTextField = 'datetime';
				} // Endif.
			} // Endif.

			outData = '<a:fld id="{' + gen_private.plugs.type.msoffice.makeUniqueID ( '5C7A2A3D' ) + '}" type="' + outTextField + '">' + startInfo;
			outData += CreateFieldText ( outTextField, slide_num );

		} else {
			// Automatic support for newline - split it into multi-p:
			parsedText = text_string.split ( "\n" );
			if ( parsedText.length > 1 ) {
				var outTextData = '';
				for ( var i = 0, total_size_i = parsedText.length; i < total_size_i; i++ ) {
					outTextData += outData + parsedText[i].encodeHTML ();

					if ( (i + 1) < total_size_i ) {
						outTextData += '</a:t></a:r></a:p><a:p>';
					} // Endif.
				} // End of for loop.

				outData = outTextData;

			} else {
				outData += text_string.encodeHTML ();
			} // Endif.
		} // Endif.

		var outBreakP = '';
		if ( text_info.breakLine ) {
			outBreakP += '</a:p><a:p>';
		} // Endif.
		
		return outData + '</a:t>' + endTag + outBreakP;
	}

	///
	/// @brief ???.
	///
	/// ???.
	///
	/// @param[in] in_data_val Input value as passed by the user.
	/// @param[in] max_value Maximum value allowed.
	/// @param[in] def_value Default value.
	/// @param[in] auto_val ???.
	/// @param[in] mul_val ???.
	/// @return ???.
	///
	function parseSmartNumber ( in_data_val, max_value, def_value, auto_val, mul_val ) {	
		if ( typeof in_data_val == 'undefined' ) {
			return (typeof def_value == 'number') ? def_value : 0;
		} // Endif.

		if ( in_data_val == '' ) {
			in_data_val = 0;
		} // Endif.
		
		if ( typeof in_data_val == 'string' && !isNaN ( in_data_val ) ) {
			in_data_val = parseInt ( in_data_val, 10 );
		} // Endif.
	
		var realNum = Math.round ( mul_val ? in_data_val * mul_val : in_data_val );

		if ( typeof in_data_val == 'string' ) {
			if ( in_data_val.indexOf ( '%' ) != -1 ) {
				var realMax = (typeof max_value == 'number') ? max_value : 0;
				if ( realMax <= 0 ) return 0;

				var realVal = parseInt ( in_data_val, 10 );
				return (realMax / 100) * realVal;
			} // Endif.

			if ( in_data_val.indexOf ( '#' ) != -1 ) {
				var realVal = parseInt ( in_data_val, 10 );
				return realMax;
			} // Endif.

			var realAuto = (typeof auto_val == 'number') ? auto_val : 0;

			if ( in_data_val == '*' ) {
				return realAuto;
			} // Endif.

			if ( in_data_val == 'c' ) {
				return realAuto / 2;
			} // Endif.

			return (typeof def_value == 'number') ? def_value : 0;
		} // Endif.
	
		if ( typeof in_data_val == 'number' ) {
			return realNum;
		} // Endif.

		return (typeof def_value == 'number') ? def_value : 0;
	}

	///
	/// @brief Create the XML code of a single effect.
	///
	/// This method creating the effect XML code for a single object.
	///
	/// @param[in] effectData Effect data.
	/// @param[in] effectName The name of the effect.
	///
	function cbGenerateEffects ( effectData, effectName ) {
		var outData = '<a:' + effectName + ' ';
		var color = effectData.color || 'black';
		var alphaPer = 60;
		var algnData = '';
		var blurRad = 50800;
		var dist = 38100;
		var dir = 13500000;

		if ( typeof effectData.transparency == 'number' ) {
			alphaPer = effectData.transparency;
		} // Endif.

		if ( (alphaPer > 100) || (alphaPer < 0) )
			alphaPer = 60;

		alphaPer = (100 - alphaPer) * 1000;

		if ( effectData.align ) {
			if ( effectData.align.top )
				algnData += 't';

			if ( effectData.align.bottom )
				algnData += 'b';

			if ( effectData.align.left )
				algnData += 'l';

			if ( effectData.align.right )
				algnData += 'r';
		} // Endif.

		if ( algnData == '' )
			algnData = 'br';

		// Size
		// Blur
		// Angle
		// Distance
		// BMK_TODO:

		outData += ' blurRad="' + blurRad + '" dist="' + dist + '" dir="' + dir + '" algn="' + algnData + '" rotWithShape="0"';

		// sx="24000" sy="24000"
		// BMK_TODO:

		outData += '><a:prstClr val="' + color + '"><a:alpha val="' + alphaPer + '"/></a:prstClr>';
		return outData + '</a:' + effectName + '>';
	}

	///
	/// @brief Create the body properties code for text.
	///
	/// This method creating the XML code of the body properties of a text.
	///
	/// @return The body properties XML code.
	///
	function createBodyProperties ( objOptions ) {
		var bodyProperties = '<a:bodyPr';

		if ( objOptions && objOptions.bodyProp ) {
			// Set anchorPoints bottom, center or top:
			if ( objOptions.bodyProp.anchor ) {
				bodyProperties += ' anchor="' + objOptions.bodyProp.anchor + '"';
			} // Endif.

			if ( objOptions.bodyProp.anchorCtr ) {
				bodyProperties += ' anchorCtr="' + objOptions.bodyProp.anchorCtr + '"';
			} // Endif.

			// Enable or disable textwrapping none or square:
			if ( objOptions.bodyProp.wrap ) {
				bodyProperties += ' wrap="' + objOptions.bodyProp.wrap + '"';

			} else {
				bodyProperties += ' wrap="square"';
			} // Endif.

			// Box margins(padding):
			// BMK_TODO: I should pass a better value as the auto_val parameter of parseSmartNumber().
			if ( objOptions.bodyProp.bIns ) {
				bodyProperties += ' bIns="' + parseSmartNumber ( objOptions.bodyProp.bIns, 6858000, 369332, 6858000, 10000 ) + '"';
			} // Endif.

			if ( objOptions.bodyProp.lIns ) {
				bodyProperties += ' lIns="' + parseSmartNumber ( objOptions.bodyProp.lIns, pptWidth, 2819400, pptWidth, 10000 ) + '"';
			} // Endif.

			if ( objOptions.bodyProp.rIns ) {
				bodyProperties += ' rIns="' + parseSmartNumber ( objOptions.bodyProp.rIns, pptWidth, 2819400, pptWidth, 10000 ) + '"';
			} // Endif.

			if ( objOptions.bodyProp.tIns ) {
				bodyProperties += ' tIns="' + parseSmartNumber ( objOptions.bodyProp.tIns, 6858000, 369332, 6858000, 10000 ) + '"';
			} // Endif.

			bodyProperties += ' rtlCol="0">';

			if ( objOptions.bodyProp.autoFit !== false ) {
				bodyProperties += '<a:spAutoFit/>';
			} // Endif.

			bodyProperties += '</a:bodyPr>';

		// Default:
		} else {
			bodyProperties += ' wrap="square" rtlCol="0"></a:bodyPr>';
		} // Endif.

		return bodyProperties;
	}

	///
	/// @brief Generate a slider resource.
	///
	/// This function generating a slider XML resource.
	///
	/// @param[in] data The main slide object.
	/// @return Text string.
	///
	function cbMakePptxSlide ( data ) {
		var outString = gen_private.plugs.type.msoffice.cbMakeMsOfficeBasicXml ( data ) + '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';
		var objs_list = data.data;
		var timingData = '';

		if ( !data.slide.show ) {
			outString += ' show="0"';
		} // Endif.

		outString += '><p:cSld>';

		if ( data.slide.back ) {
			outString += cMakePptxColorSelection ( false, data.slide.back );
		} // Endif.

		outString += '<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>';

		// Loop on all the objects inside the slide to add it into the slide:
		for ( var i = 0, total_size = objs_list.length; i < total_size; i++ ) {
			var x = 0;
			var y = 0;
			var cx = 2819400;
			var cy = 369332;

			var moreStyles = '';
			var moreStylesAttr = '';
			var outStyles = '';
			var styleData = '';
			var shapeType = null;
			var locationAttr = '';

			if ( objs_list[i].options ) {
				if ( typeof objs_list[i].options.cx != 'undefined' ) {
					if ( objs_list[i].options.cx ) {
						cx = parseSmartNumber ( objs_list[i].options.cx, pptWidth, 2819400, pptWidth, 10000 );
					} else {
						cx = 1;
					} // Endif.
				} // Endif.

				if ( typeof objs_list[i].options.cy != 'undefined' ) {
					if ( objs_list[i].options.cy ) {
						cy = parseSmartNumber ( objs_list[i].options.cy, 6858000, 369332, 6858000, 10000 );

					} else {
						cy = 1;
					} // Endif.
				} // Endif.

				if ( objs_list[i].options.x ) {
					x = parseSmartNumber ( objs_list[i].options.x, pptWidth, 0, pptWidth - cx, 10000 );
				} // Endif.

				if ( objs_list[i].options.y ) {
					y = parseSmartNumber ( objs_list[i].options.y, 6858000, 0, 6858000 - cy, 10000 );
				} // Endif.

				if ( objs_list[i].options.shape ) {
					shapeType = getShapeInfo ( objs_list[i].options.shape );
				} // Endif.

				if ( objs_list[i].options.flip_vertical ) {
					locationAttr += ' flipV="1"';
				} // Endif.

				if ( objs_list[i].options.rotate ) {
					var rotateVal = objs_list[i].options.rotate > 360 ? (objs_list[i].options.rotate - 360) : objs_list[i].options.rotate;
					rotateVal *= 60000;
					locationAttr += ' rot="' + rotateVal + '"';
				} // Endif.
			} // Endif.

			switch ( objs_list[i].type ) {
				case 'text':
				case 'cxn':
					var effectsList = '';

					if ( shapeType == null ) shapeType = getShapeInfo ( null );

					// if ( objs_list[i].type == 'text' ) {
					// 	if ( !objs_list[i].options || (!objs_list[i].options.cx && !objs_list[i].options.cx) ) {
					// 		objs_list[i].options = objs_list[i].options ? objs_list[i].options : {};
					// 		objs_list[i].options.bodyProp = objs_list[i].options.bodyProp ? objs_list[i].options.bodyProp : {};
					// 		objs_list[i].options.bodyProp.autoFit = true;
					// 		cx = pptWidth - x;
					// 		cy = 6858000 - y;
					// 	} // Endif.
					// } // Endif.

					if ( objs_list[i].type == 'cxn' ) {
						outString += '<p:cxnSp><p:nvCxnSpPr>';
						outString += '<p:cNvPr id="' + (i + 2) + '" name="Object ' + (i + 1) + '"/><p:nvPr/></p:nvCxnSpPr>';

					} else {
						outString += '<p:sp><p:nvSpPr>';
						outString += '<p:cNvPr id="' + (i + 2) + '" name="Object ' + (i + 1) + '"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>';
					} // Endif.

					outString += '<p:spPr>';

					outString += '<a:xfrm' + locationAttr + '>';

					outString += '<a:off x="' + x + '" y="' + y + '"/><a:ext cx="' + cx + '" cy="' + cy + '"/></a:xfrm><a:prstGeom prst="' + shapeType.name + '"><a:avLst/></a:prstGeom>';

					if ( objs_list[i].options ) {
						if ( objs_list[i].options.fill ) {
							outString += cMakePptxColorSelection ( objs_list[i].options.fill );

						} else {
							outString += '<a:noFill/>';
						} // Endif.

						if ( objs_list[i].options.line ) {
							var lineAttr = '';

							if ( objs_list[i].options.line_size ) {
								lineAttr += ' w="' + (objs_list[i].options.line_size * 12700) + '"';
							} // Endif.

							// cmpd="dbl"

							outString += '<a:ln' + lineAttr + '>';
							outString += cMakePptxColorSelection ( objs_list[i].options.line );

							if ( objs_list[i].options.line_head ) {
								outString += '<a:headEnd type="' + objs_list[i].options.line_head + '"/>';
							} // Endif.

							if ( objs_list[i].options.line_tail ) {
								outString += '<a:tailEnd type="' + objs_list[i].options.line_tail + '"/>';
							} // Endif.

							outString += '</a:ln>';
						} // Endif.

					} else {
						outString += '<a:noFill/>';
					} // Endif.

					if ( objs_list[i].options.effects ) {
						for ( var ii = 0, total_size_ii = objs_list[i].options.effects.length; ii < total_size_ii; ii++ ) {
							switch ( objs_list[i].options.effects[ii].type ) {
								case 'outerShadow':
									effectsList += cbGenerateEffects ( objs_list[i].options.effects[ii], 'outerShdw' );
									break;

								case 'innerShadow':
									effectsList += cbGenerateEffects ( objs_list[i].options.effects[ii], 'innerShdw' );
									break;
							} // End of switch.
						} // End of for loop.
					} // Endif.

					if ( effectsList != '' ) {
						outString += '<a:effectLst>' + effectsList + '</a:effectLst>';
					} // Endif.

					outString += '</p:spPr>';

					if ( objs_list[i].options ) {
						if ( objs_list[i].options.align ) {
							switch ( objs_list[i].options.align )
							{
								case 'right':
									moreStylesAttr += ' algn="r"';
									break;

								case 'center':
									moreStylesAttr += ' algn="ctr"';
									break;

								case 'justify':
									moreStylesAttr += ' algn="just"';
									break;
							} // End of switch.
						} // Endif.

						if ( objs_list[i].options.indentLevel > 0 ) {
								moreStylesAttr += ' lvl="' + objs_list[i].options.indentLevel + '"';
						} // Endif.
					} // Endif.

					if ( moreStyles != '' ) {
						outStyles = '<a:pPr' + moreStylesAttr + '>' + moreStyles + '</a:pPr>';

					} else if ( moreStylesAttr != '' ) {
						outStyles = '<a:pPr' + moreStylesAttr + '/>';
					} // Endif.

					if ( styleData != '' ) {
						outString += '<p:style>' + styleData + '</p:style>';
					} // Endif.

					if ( typeof objs_list[i].text == 'string' ) {
						outString += '<p:txBody>' + createBodyProperties ( objs_list[i].options ) + '<a:lstStyle/><a:p>' + outStyles;
						outString += cMakePptxOutTextCommand ( objs_list[i].options, objs_list[i].text, data.slide, data.slide.getPageNumber () );

					} else if ( typeof objs_list[i].text == 'number' ) {
						outString += '<p:txBody>' + createBodyProperties ( objs_list[i].options ) + '<a:lstStyle/><a:p>' + outStyles;
						outString += cMakePptxOutTextCommand ( objs_list[i].options, objs_list[i].text + '', data.slide, data.slide.getPageNumber () );

					} else if ( objs_list[i].text && objs_list[i].text.length ) {
						var outBodyOpt = createBodyProperties ( objs_list[i].options );
						outString += '<p:txBody>' + outBodyOpt + '<a:lstStyle/><a:p>' + outStyles;

						for ( var j = 0, total_size_j = objs_list[i].text.length; j < total_size_j; j++ ) {
							if ( (typeof objs_list[i].text[j] == 'object') && objs_list[i].text[j].text ) {
								outString += cMakePptxOutTextCommand ( objs_list[i].text[j].options || objs_list[i].options, objs_list[i].text[j].text, data.slide, outBodyOpt, outStyles, data.slide.getPageNumber () );

							} else if ( typeof objs_list[i].text[j] == 'string' ) {
								outString += cMakePptxOutTextCommand ( objs_list[i].options, objs_list[i].text[j], data.slide, outBodyOpt, outStyles, data.slide.getPageNumber () );

							} else if ( typeof objs_list[i].text[j] == 'number' ) {
								outString += cMakePptxOutTextCommand ( objs_list[i].options, objs_list[i].text[j] + '', data.slide, outBodyOpt, outStyles, data.slide.getPageNumber () );

							} else if ( (typeof objs_list[i].text[j] == 'object') && objs_list[i].text[j].field ) {
								outString += cMakePptxOutTextCommand ( objs_list[i].options, objs_list[i].text[j], data.slide, outBodyOpt, outStyles, data.slide.getPageNumber () );
							} // Endif.
						} // Endif.

					} else if ( (typeof objs_list[i].text == 'object') && objs_list[i].text.field ) {
						outString += '<p:txBody>' + createBodyProperties ( objs_list[i].options ) + '<a:lstStyle/><a:p>' + outStyles;
						outString += cMakePptxOutTextCommand ( objs_list[i].options, objs_list[i].text, data.slide, data.slide.getPageNumber () );
					} // Endif.

					// We must add that at the end of every paragraph with text:
					if ( typeof objs_list[i].text != 'undefined' ) {
						var font_size = '';
						if ( objs_list[i].options && objs_list[i].options.font_size ) {
							font_size = ' sz="' + objs_list[i].options.font_size + '00"';
						} // Endif.

						outString += '<a:endParaRPr lang="en-US"' + font_size + ' dirty="0"/></a:p></p:txBody>';
					} // Endif.

					outString += objs_list[i].type == 'cxn' ? '</p:cxnSp>' : '</p:sp>';
					break;

				// Table:
				case 'table':
					outString += '<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="' + (i + 2) + '" name="Object ' + (i + 1) + '"/><p:cNvGraphicFramePr><a:graphicFrameLocks noGrp="1"/></p:cNvGraphicFramePr><p:nvPr/></p:nvGraphicFramePr>';
					outString += '<p:xfrm><a:off x="' + x + '" y="' + y + '"/><a:ext cx="' + cx + '" cy="' + cy + '"/></p:xfrm>';
					outString += '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table"><a:tbl><a:tblPr firstRow="1" bandRow="1"><a:tableStyleId>{073A0DAA-6AF3-43AB-8588-CEC1D06C72B9}</a:tableStyleId></a:tblPr><a:tblGrid>';
					// <a:gridCol w="3276600"/>
					outString += '</a:tblGrid>';
					// objs_list[i].options
					// objs_list[i].rows[][].text
					// BMK_TODO:
					break;

				// Image:
				case 'image':
					outString += '<p:pic><p:nvPicPr><p:cNvPr id="' + (i + 2) + '" name="Object ' + (i + 1) + '"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="rId' + objs_list[i].rel_id + '" cstate="print"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm' + locationAttr + '><a:off x="' + x + '" y="' + y + '"/><a:ext cx="' + cx + '" cy="' + cy + '"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>';
					break;

				// Paragraph:
				case 'p':
					if ( shapeType == null ) shapeType = getShapeInfo ( null );

					outString += '<p:sp><p:nvSpPr>';
					outString += '<p:cNvPr id="' + (i + 2) + '" name="Object ' + (i + 1) + '"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>';
					outString += '<p:spPr>';

					outString += '<a:xfrm' + locationAttr + '>';

					outString += '<a:off x="' + x + '" y="' + y + '"/><a:ext cx="' + cx + '" cy="' + cy + '"/></a:xfrm><a:prstGeom prst="' + shapeType.name + '"><a:avLst/></a:prstGeom>';

					if ( objs_list[i].options ) {
						if ( objs_list[i].options.fill ) {
							outString += cMakePptxColorSelection ( objs_list[i].options.fill );

						} else {
							outString += '<a:noFill/>';
						} // Endif.

						if ( objs_list[i].options.line ) {
							outString += '<a:ln>';
							outString += cMakePptxColorSelection ( objs_list[i].options.line );

							if ( objs_list[i].options.line_head ) {
								outString += '<a:headEnd type="' + objs_list[i].options.line_head + '"/>';
							} // Endif.

							if ( objs_list[i].options.line_tail ) {
								outString += '<a:tailEnd type="' + objs_list[i].options.line_tail + '"/>';
							} // Endif.

							outString += '</a:ln>';
						} // Endif.

					} else {
						outString += '<a:noFill/>';
					} // Endif.

					outString += '</p:spPr>';

					if ( styleData != '' ) {
						outString += '<p:style>' + styleData + '</p:style>';
					} // Endif.

					outString += '<p:txBody><a:bodyPr wrap="square" rtlCol="0"><a:spAutoFit/></a:bodyPr><a:lstStyle/>';

					for ( var j = 0, total_size_j = objs_list[i].data.length; j < total_size_j; j++ ) {
						if ( objs_list[i].data[j] ) {
							moreStylesAttr = '';
							moreStyles = '';
							
							if ( objs_list[i].data[j].options ) {
								if ( objs_list[i].data[j].options.align ) {
									switch ( objs_list[i].data[j].options.align )
									{
										case 'right':
											moreStylesAttr += ' algn="r"';
											break;

										case 'center':
											moreStylesAttr += ' algn="ctr"';
											break;

										case 'justify':
											moreStylesAttr += ' algn="just"';
											break;
									} // End of switch.
								} // Endif.

								if ( objs_list[i].data[j].options.indentLevel > 0 ) {
									moreStylesAttr += ' lvl="' + objs_list[i].data[j].options.indentLevel + '"';
								} // Endif.

								if ( objs_list[i].data[j].options.listType == 'number' ) {
									moreStyles += '<a:buFont typeface="+mj-lt"/><a:buAutoNum type="arabicPeriod"/>';
								} // Endif.
							} // Endif.

							if ( moreStyles != '' ) {
								outStyles = '<a:pPr' + moreStylesAttr + '>' + moreStyles + '</a:pPr>';

							} else if ( moreStylesAttr != '' ) {
								outStyles = '<a:pPr' + moreStylesAttr + '/>';
							} // Endif.

							outString += '<a:p>' + outStyles;

							// if ( typeof objs_list[i].data[j].text == 'string' ) {
							outString += cMakePptxOutTextCommand ( objs_list[i].data[j].options, objs_list[i].data[j].text, data.slide, data.slide.getPageNumber () );
							// BMK_TODO:
						} // Endif.
					} // Endif.

					var font_size = '';
					if ( objs_list[i].options && objs_list[i].options.font_size ) {
						font_size = ' sz="' + objs_list[i].options.font_size + '00"';
					} // Endif.

					outString += '<a:endParaRPr lang="en-US"' + font_size + ' dirty="0"/></a:p>';
					outString += '</p:txBody>';

					outString += '</p:sp>';
					break;
			} // End of switch.
		} // End of for loop.
		
		outString += '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>';

		if ( timingData != '' ) {
			outString += '<p:timing>' + timingData + '</p:timing>';
		} // Endif.

		outString += '</p:sld>';
		return outString;
	}

	///
	/// @brief Generate the extended attributes file (app) for PPTX/PPSX documents.
	///
	/// ???.
	///
	/// @param[in] data Ignored by this callback function.
	/// @return Text string.
	///
	function cbMakePptxApp ( data ) {
		var slidesCount = gen_private.pages.length;
		var userName = genobj.options.creator || 'officegen';
		var outString = gen_private.plugs.type.msoffice.cbMakeMsOfficeBasicXml ( data ) + '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><TotalTime>0</TotalTime><Words>0</Words><Application>Microsoft Office PowerPoint</Application><PresentationFormat>On-screen Show (4:3)</PresentationFormat><Paragraphs>0</Paragraphs><Slides>' + slidesCount + '</Slides><Notes>0</Notes><HiddenSlides>0</HiddenSlides><MMClips>0</MMClips><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="4" baseType="variant"><vt:variant><vt:lpstr>Theme</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant><vt:variant><vt:lpstr>Slide Titles</vt:lpstr></vt:variant><vt:variant><vt:i4>' + slidesCount + '</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="' + (slidesCount + 1) + '" baseType="lpstr"><vt:lpstr>Office Theme</vt:lpstr>';

		for ( var i = 0, total_size = gen_private.pages.length; i < total_size; i++ ) {
			outString += '<vt:lpstr>' + gen_private.pages[i].slide.name.encodeHTML () + '</vt:lpstr>';
		} // End of for loop.

		outString += '</vt:vector></TitlesOfParts><Company>' + userName + '</Company><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>12.0000</AppVersion></Properties>';
		return outString;
	}

	// Prepare genobj for MS-Office:
	msdoc.makemsdoc ( genobj, new_type, options, gen_private, type_info );
	gen_private.plugs.type.msoffice.makeOfficeGenerator ( 'ppt', 'presentation', {} );

	gen_private.features.page_name = 'slides'; // This document type must have pages.

	gen_private.plugs.type.msoffice.addInfoType ( 'dc:title', '', 'title', 'setDocTitle' );

	genobj.on ( 'beforeGen', cbPreparePptxToGenerate );

	var type_of_main_doc = 'slideshow';
	if ( new_type != 'ppsx' )
	{
		type_of_main_doc = 'presentation';
	} // Endif.

	gen_private.type.msoffice.files_list.push (
		{
			name: '/ppt/slideMasters/slideMaster1.xml',
			type: 'application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml',
			clear: 'type'
		},
		{
			name: '/ppt/presProps.xml',
			type: 'application/vnd.openxmlformats-officedocument.presentationml.presProps+xml',
			clear: 'type'
		},
		{
			name: '/ppt/presentation.xml',
			type: 'application/vnd.openxmlformats-officedocument.presentationml.' + type_of_main_doc + '.main+xml',
			clear: 'type'
		},
		{
			name: '/ppt/slideLayouts/slideLayout1.xml',
			type: 'application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml',
			clear: 'type'
		},
		{
			name: '/ppt/tableStyles.xml',
			type: 'application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml',
			clear: 'type'
		},
		{
			name: '/ppt/viewProps.xml',
			type: 'application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml',
			clear: 'type'
		}
	);

	gen_private.plugs.intAddAnyResourceToParse ( 'ppt\\presProps.xml', 'buffer', null, cbMakePptxPresProps, true );
	gen_private.plugs.intAddAnyResourceToParse ( 'ppt\\tableStyles.xml', 'buffer', null, cbMakePptxStyles, true );
	gen_private.plugs.intAddAnyResourceToParse ( 'ppt\\viewProps.xml', 'buffer', null, cbMakePptxViewProps, true );
	gen_private.plugs.intAddAnyResourceToParse ( 'ppt\\presentation.xml', 'buffer', null, cbMakePptxPresentation, true );

	gen_private.plugs.intAddAnyResourceToParse ( 'ppt\\slideLayouts\\slideLayout1.xml', 'buffer', null, cbMakePptxLayout, true );
	gen_private.plugs.intAddAnyResourceToParse ( 'ppt\\slideLayouts\\_rels\\slideLayout1.xml.rels', 'buffer', [
		{
			type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster',
			target: '../slideMasters/slideMaster1.xml'
		}
	], gen_private.plugs.type.msoffice.cbMakeRels, true );

	gen_private.plugs.intAddAnyResourceToParse ( 'ppt\\slideMasters\\slideMaster1.xml', 'buffer', null, cbMakePptxSlideMasters, true );
	gen_private.plugs.intAddAnyResourceToParse ( 'ppt\\slideMasters\\_rels\\slideMaster1.xml.rels', 'buffer', [
		{
			type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout',
			target: '../slideLayouts/slideLayout1.xml'
		},
		{
			type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme',
			target: '../theme/theme1.xml'
		}
	], gen_private.plugs.type.msoffice.cbMakeRels, true );

	gen_private.plugs.intAddAnyResourceToParse ( 'docProps\\app.xml', 'buffer', null, cbMakePptxApp, true );

	gen_private.type.msoffice.rels_app.push (
		{
			type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster',
			target: 'slideMasters/slideMaster1.xml',
			clear: 'type'
		}
	);

	gen_private.plugs.intAddAnyResourceToParse ( 'ppt\\_rels\\presentation.xml.rels', 'buffer', gen_private.type.msoffice.rels_app, gen_private.plugs.type.msoffice.cbMakeRels, true );

	// ----- API for PowerPoint documents: -----

	///
	/// @brief Create a new slide.
	///
	/// This method creating a new slide inside the presentation.
	///
	/// @return The new slide object.
	///
	genobj.makeNewSlide = function () {
		var pageNumber = gen_private.pages.length;
		var slideObj = { show: true }; // The slide object that the user will use.

		gen_private.pages[pageNumber] = {};
		gen_private.pages[pageNumber].slide = slideObj;
		gen_private.pages[pageNumber].data = [];
		gen_private.pages[pageNumber].rels = [
			{
				type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout',
				target: '../slideLayouts/slideLayout1.xml',
				clear: 'data'
			}
		];

		gen_private.type.msoffice.files_list.push (
			{
				name: '/ppt/slides/slide' + (pageNumber + 1) + '.xml',
				type: 'application/vnd.openxmlformats-officedocument.presentationml.slide+xml',
				clear: 'data'
			}
		);

		gen_private.type.msoffice.rels_app.push (
			{
				type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide',
				target: 'slides/slide' + (pageNumber + 1) + '.xml',
				clear: 'data'
			}
		);

		slideObj.getPageNumber = function () { return pageNumber; };

		slideObj.name = 'Slide ' + (pageNumber + 1);

		///
		/// @brief ???.
		///
		/// ???.
		///
		/// @param[in] prgObj Paragraph object.
		///
		function addParagraphApiForBasicOpt ( prgObj ) {
			if ( !prgObj.api ) {
				prgObj.api = {};
			} // Endif.

			prgObj.api.options = prgObj.options;
		}

		///
		/// @brief ???.
		///
		/// ???.
		///
		/// @param[in] prgObj Paragraph object.
		///
		function addParagraphApiForEffects ( prgObj ) {
			if ( !prgObj.api ) {
				prgObj.api = {};
			} // Endif.

			///
			/// @brief ???.
			///
			/// ???.
			///
			/// @param[in] inType ???.
			/// @param[in] inAlign ???.
			/// @param[in] inColor ???.
			/// @param[in] inTransparency ???.
			/// @param[in] inSize ???.
			/// @param[in] inBlur ???.
			/// @param[in] inAngle ???.
			/// @param[in] inDistance ???.
			///
			prgObj.api.setShadowEffect = function ( inType, inAlign, inColor, inTransparency, inSize, inBlur, inAngle, inDistance ) {
				if ( !prgObj.options.effects )
					prgObj.options.effects = [];

				var newEffect = {
					'type': inType,
					'align': inAlign,
					'color': inColor,
					'transparency': inTransparency,
					'size': inSize,
					'blur': inBlur,
					'angle': inAngle,
					'distance': inDistance
				};

				prgObj.options.effects.push ( newEffect );
			};
		}

		///
		/// @brief ???.
		///
		/// ???.
		///
		/// @param[in] text ???.
		/// @param[in] opt ???.
		/// @param[in] y_pos ???.
		/// @param[in] x_size ???.
		/// @param[in] y_size ???.
		/// @param[in] opt_b ???.
		///
		slideObj.addText = function ( text, opt, y_pos, x_size, y_size, opt_b ) {
			var objNumber = gen_private.pages[pageNumber].data.length;

			gen_private.pages[pageNumber].data[objNumber] = {};
			gen_private.pages[pageNumber].data[objNumber].type = 'text';
			gen_private.pages[pageNumber].data[objNumber].text = text;
			gen_private.pages[pageNumber].data[objNumber].options = typeof opt == 'object' ? opt : {};

			if ( typeof opt == 'string' ) {
				gen_private.pages[pageNumber].data[objNumber].options.color = opt;

			} else if ( (typeof opt != 'object') && (typeof y_pos != 'undefined') ) {
				gen_private.pages[pageNumber].data[objNumber].options.x = opt;
				gen_private.pages[pageNumber].data[objNumber].options.y = y_pos;

				if ( (typeof x_size != 'undefined') && (typeof y_size != 'undefined') ) {
					gen_private.pages[pageNumber].data[objNumber].options.cx = x_size;
					gen_private.pages[pageNumber].data[objNumber].options.cy = y_size;
				} // Endif.
			} // Endif.

			if ( typeof opt_b == 'object' ) {
				for ( var attrname in opt_b ) { gen_private.pages[pageNumber].data[objNumber].options[attrname] = opt_b[attrname]; }

			} else if ( (typeof x_size == 'object') && (typeof y_size == 'undefined') ) {
				for ( var attrname in x_size ) { gen_private.pages[pageNumber].data[objNumber].options[attrname] = x_size[attrname]; }
			} // Endif.

			addParagraphApiForBasicOpt ( gen_private.pages[pageNumber].data[objNumber] );
			addParagraphApiForEffects ( gen_private.pages[pageNumber].data[objNumber] );
			return gen_private.pages[pageNumber].data[objNumber].api;
		};

		///
		/// @brief ???.
		///
		/// ???.
		///
		/// @param[in] shape ???.
		/// @param[in] opt ???.
		/// @param[in] y_pos ???.
		/// @param[in] x_size ???.
		/// @param[in] y_size ???.
		/// @param[in] opt_b ???.
		///
		slideObj.addShape = function ( shape, opt, y_pos, x_size, y_size, opt_b ) {
			var objNumber = gen_private.pages[pageNumber].data.length;

			gen_private.pages[pageNumber].data[objNumber] = {};
			gen_private.pages[pageNumber].data[objNumber].type = 'text';
			gen_private.pages[pageNumber].data[objNumber].options = typeof opt == 'object' ? opt : {};
			gen_private.pages[pageNumber].data[objNumber].options.shape = shape;

			if ( typeof opt == 'string' ) {
				gen_private.pages[pageNumber].data[objNumber].options.color = opt;

			} else if ( (typeof opt != 'object') && (typeof y_pos != 'undefined') ) {
				gen_private.pages[pageNumber].data[objNumber].options.x = opt;
				gen_private.pages[pageNumber].data[objNumber].options.y = y_pos;

				if ( (typeof x_size != 'undefined') && (typeof y_size != 'undefined') ) {
					gen_private.pages[pageNumber].data[objNumber].options.cx = x_size;
					gen_private.pages[pageNumber].data[objNumber].options.cy = y_size;
				} // Endif.
			} // Endif.

			if ( typeof opt_b == 'object' ) {
				for ( var attrname in opt_b ) { gen_private.pages[pageNumber].data[objNumber].options[attrname] = opt_b[attrname]; }

			} else if ( (typeof x_size == 'object') && (typeof y_size == 'undefined') ) {
				for ( var attrname in x_size ) { gen_private.pages[pageNumber].data[objNumber].options[attrname] = x_size[attrname]; }
			} // Endif.

			addParagraphApiForBasicOpt ( gen_private.pages[pageNumber].data[objNumber] );
			addParagraphApiForEffects ( gen_private.pages[pageNumber].data[objNumber] );
			return gen_private.pages[pageNumber].data[objNumber].api;
		};

		///
		/// @brief ???.
		///
		/// ???.
		///
		/// @param[in] image_path ???.
		/// @param[in] opt ???.
		/// @param[in] y_pos ???.
		/// @param[in] x_size ???.
		/// @param[in] y_size ???.
		/// @param[in] image_format_type ???.
		///
		slideObj.addImage = function ( image_path, opt, y_pos, x_size, y_size, image_format_type ) {
			var objNumber = gen_private.pages[pageNumber].data.length;
			var image_type = (typeof image_format_type == 'string') ? image_format_type : 'png';
			var defWidth, defHeight = 0;

			if ( typeof image_path == 'string' ) {
				var ret_data = fast_image_size ( image_path );
				if ( ret_data.type == 'unknown' ) {
					var image_ext = path.extname ( image_path );

					switch ( image_ext ) {
						case '.bmp':
							image_type = 'bmp';
							break;

						case '.gif':
							image_type = 'gif';
							break;

						case '.jpg':
						case '.jpeg':
							image_type = 'jpeg';
							break;

						case '.emf':
							image_type = 'emf';
							break;

						case '.tiff':
							image_type = 'tiff';
							break;
					} // End of switch.

				} else {
					if ( ret_data.width ) {
						defWidth = ret_data.width;
					} // Endif.

					if ( ret_data.height ) {
						defHeight = ret_data.height;
					} // Endif.

					image_type = ret_data.type;
					if ( image_type == 'jpg' ) {
						image_type = 'jpeg';
					} // Endif.
				} // Endif.
			} // Endif.

			gen_private.pages[pageNumber].data[objNumber] = {};
			gen_private.pages[pageNumber].data[objNumber].type = 'image';
			gen_private.pages[pageNumber].data[objNumber].image = image_path;
			gen_private.pages[pageNumber].data[objNumber].options = typeof opt == 'object' ? opt : {};

			if ( !gen_private.pages[pageNumber].data[objNumber].options.cx && defWidth ) {
				gen_private.pages[pageNumber].data[objNumber].options.cx = defWidth;
			} // Endif.

			if ( !gen_private.pages[pageNumber].data[objNumber].options.cy && defHeight ) {
				gen_private.pages[pageNumber].data[objNumber].options.cy = defHeight;
			} // Endif.

			var image_id = gen_private.type.msoffice.src_files_list.indexOf ( image_path );
			var image_rel_id = -1;

			if ( image_id >= 0 ) {
				for ( var j = 0, total_size_j = gen_private.pages[pageNumber].rels.length; j < total_size_j; j++ ) {
					if ( gen_private.pages[pageNumber].rels[j].target == ('../media/image' + (image_id + 1) + '.' + image_type) ) {
						image_rel_id = j + 1;
					} // Endif.
				} // Endif.
			
			} else
			{
				image_id = gen_private.type.msoffice.src_files_list.length;
				gen_private.type.msoffice.src_files_list[image_id] = image_path;
				gen_private.plugs.intAddAnyResourceToParse ( 'ppt\\media\\image' + (image_id + 1) + '.' + image_type, (typeof image_path == 'string') ? 'file' : 'stream', image_path, null, false );
			} // Endif.

			if ( image_rel_id == -1 ) {
				image_rel_id = gen_private.pages[pageNumber].rels.length + 1;

				gen_private.pages[pageNumber].rels.push (
					{
						type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image',
						target: '../media/image' + (image_id + 1) + '.' + image_type,
						clear: 'data'
					}
				);
			} // Endif.

			gen_private.pages[pageNumber].data[objNumber].image_id = image_id;
			gen_private.pages[pageNumber].data[objNumber].rel_id = image_rel_id;

			if ( typeof opt == 'string' ) {
				gen_private.pages[pageNumber].data[objNumber].options.color = opt;

			} else if ( (typeof opt != 'object') && (typeof y_pos != 'undefined') ) {
				gen_private.pages[pageNumber].data[objNumber].options.x = opt;
				gen_private.pages[pageNumber].data[objNumber].options.y = y_pos;

				if ( (typeof x_size != 'undefined') && (typeof y_size != 'undefined') ) {
					gen_private.pages[pageNumber].data[objNumber].options.cx = x_size;
					gen_private.pages[pageNumber].data[objNumber].options.cy = y_size;
				} // Endif.
			} // Endif.

			addParagraphApiForBasicOpt ( gen_private.pages[pageNumber].data[objNumber] );
			addParagraphApiForEffects ( gen_private.pages[pageNumber].data[objNumber] );
			return gen_private.pages[pageNumber].data[objNumber].api;
		};

		///
		/// @brief ???.
		///
		/// ???.
		///
		/// @param[in] text ???.
		/// @param[in] opt ???.
		/// @param[in] y_pos ???.
		/// @param[in] x_size ???.
		/// @param[in] y_size ???.
		/// @param[in] opt_b ???.
		///
		slideObj.addP = function ( text, opt, y_pos, x_size, y_size, opt_b ) {
			var objNumber = gen_private.pages[pageNumber].data.length;

			gen_private.pages[pageNumber].data[objNumber] = {};
			gen_private.pages[pageNumber].data[objNumber].type = 'p';
			gen_private.pages[pageNumber].data[objNumber].data = [];
			gen_private.pages[pageNumber].data[objNumber].options = typeof opt == 'object' ? opt : {};

			if ( typeof opt == 'string' ) {
				gen_private.pages[pageNumber].data[objNumber].options.color = opt;

			} else if ( (typeof opt != 'object') && (typeof y_pos != 'undefined') ) {
				gen_private.pages[pageNumber].data[objNumber].options.x = opt;
				gen_private.pages[pageNumber].data[objNumber].options.y = y_pos;

				if ( (typeof x_size != 'undefined') && (typeof y_size != 'undefined') ) {
					gen_private.pages[pageNumber].data[objNumber].options.cx = x_size;
					gen_private.pages[pageNumber].data[objNumber].options.cy = y_size;
				} // Endif.
			} // Endif.

			if ( typeof opt_b == 'object' ) {
				for ( var attrname in opt_b ) { gen_private.pages[pageNumber].data[objNumber].options[attrname] = opt_b[attrname]; }

			} else if ( (typeof x_size == 'object') && (typeof y_size == 'undefined') ) {
				for ( var attrname in x_size ) { gen_private.pages[pageNumber].data[objNumber].options[attrname] = x_size[attrname]; }
			} // Endif.

			// BMK_TODO:

			return gen_private.pages[pageNumber].data[objNumber].data;
		};

		slideObj.addDateToHeader = function () {
			if ( !gen_private.pages[pageNumber].header ) {
				gen_private.pages[pageNumber].header = {};
			} // Endif.

			// gen_private.pages[pageNumber]
			// <a:fld id="{5C7A2A3D-B97F-4EB0-B937-FE8C3AFCAC1A}" type="datetime1">
			// BMK_TODO:
		};

		gen_private.plugs.intAddAnyResourceToParse ( 'ppt\\slides\\slide' + (pageNumber + 1) + '.xml', 'buffer', gen_private.pages[pageNumber], cbMakePptxSlide, false );
		gen_private.plugs.intAddAnyResourceToParse ( 'ppt\\slides\\_rels\\slide' + (pageNumber + 1) + '.xml.rels', 'buffer', gen_private.pages[pageNumber].rels, gen_private.plugs.type.msoffice.cbMakeRels, false );		
		return slideObj;
	};

	genobj.setWidescreen = function(wide){
		pptWidth 	= wide ? 12191996 		: 9144000;
		pptType 	= wide ? 'screen16x9' 	: 'screen4x3';
	}
}

var pptxSchema = {};

baseobj.plugins.registerDocType ( 'pptx', makePptx, pptxSchema, baseobj.docType.PRESENTATION, "Microsoft PowerPoint Document" );
baseobj.plugins.registerDocType ( 'ppsx', makePptx, pptxSchema, baseobj.docType.PRESENTATION, "Microsoft PowerPoint Slideshow Document" );

