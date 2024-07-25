/**
 * 开发版本的文件导入
 */
(function () {
    var paths = [
            'editor.js',
            'core/browser.js',
            'core/utils.js',
            'core/EventBase.js',
            'core/dtd.js',
            'core/domUtils.js',
            'core/Range.js',
            'core/Selection.js',
            'core/Editor.js',
            'core/Editor.defaultoptions.js',
            'core/loadconfig.js',
            'core/ajax.js',
            'core/api.js',
            'core/image.js',
            'core/dialog.js',
            'core/filterword.js',
            'core/node.js',
            'core/htmlparser.js',
            'core/filternode.js',
            'core/plugin.js',
            'core/keymap.js',
            'core/localstorage.js',
            'plugins/defaultfilter.js',
            'plugins/inserthtml.js',
            'plugins/autotypeset.js',
            'plugins/autosubmit.js',
            'plugins/background.js',
            'plugins/image.js',
            'plugins/justify.js',
            'plugins/font.js',
            'plugins/link.js',
            'plugins/iframe.js',
            'plugins/scrawl.js',
            'plugins/removeformat.js',
            'plugins/blockquote.js',
            'plugins/convertcase.js',
            'plugins/indent.js',
            'plugins/print.js',
            'plugins/preview.js',
            'plugins/selectall.js',
            'plugins/paragraph.js',
            'plugins/directionality.js',
            'plugins/horizontal.js',
            'plugins/time.js',
            'plugins/rowspacing.js',
            'plugins/lineheight.js',
            'plugins/insertcode.js',
            'plugins/cleardoc.js',
            'plugins/anchor.js',
            'plugins/wordcount.js',
            'plugins/pagebreak.js',
            'plugins/wordimage.js',
            'plugins/autosave.js',
            'plugins/formula.js',
            'plugins/dragdrop.js',
            'plugins/undo.js',
            'plugins/copy.js',
            'plugins/paste.js',
            'plugins/puretxtpaste.js',
            'plugins/list.js',
            'plugins/source.js',
            'plugins/enterkey.js',
            'plugins/keystrokes.js',
            'plugins/fiximgclick.js',
            'plugins/autolink.js',
            'plugins/autoheight.js',
            'plugins/autofloat.js',
            'plugins/video.js',
            'plugins/audio.js',
            'plugins/table.core.js',
            'plugins/table.cmds.js',
            'plugins/table.action.js',
            'plugins/table.sort.js',
            'plugins/contextmenu.js',
            'plugins/shortcutmenu.js',
            'plugins/basestyle.js',
            'plugins/elementpath.js',
            'plugins/formatmatch.js',
            'plugins/searchreplace.js',
            'plugins/customstyle.js',
            'plugins/catchremoteimage.js',
            'plugins/insertparagraph.js',
            'plugins/template.js',
            'plugins/autoupload.js',
            'plugins/section.js',
            'plugins/simpleupload.js',
            'plugins/serverparam.js',
            'plugins/insertfile.js',
            'plugins/markdown-shortcut.js',
            'plugins/quick-operate.js',

            'ui/ui.js',
            'ui/uiutils.js',
            'ui/uibase.js',
            'ui/separator.js',
            'ui/mask.js',
            'ui/popup.js',
            'ui/colorpicker.js',
            'ui/tablepicker.js',
            'ui/stateful.js',
            'ui/button.js',
            'ui/splitbutton.js',
            'ui/colorbutton.js',
            'ui/tablebutton.js',
            'ui/autotypesetpicker.js',
            'ui/autotypesetbutton.js',
            'ui/cellalignpicker.js',
            'ui/pastepicker.js',
            'ui/toolbar.js',
            'ui/quick-operate.js',
            'ui/menu.js',
            'ui/combox.js',
            'ui/dialog.js',
            'ui/menubutton.js',
            'ui/multiMenu.js',
            'ui/shortcutmenu.js',
            'ui/breakline.js',
            'ui/message.js',

            'adapter/editorui.js',
            'adapter/editor.js',
            'adapter/message.js',
        ],
        baseURL = '../_src/';
    if (window.UEDITOR_HOME_URL) {
        baseURL = window.UEDITOR_HOME_URL + '_src/';
    }
    // 页面先加载执行 ueditor.config.js 然后加载执行 editor_api.js 这个文件动态把编辑器需要用到的脚本文件注入到页面中
    for (var i = 0, pi; pi = paths[i++];) {
        document.write('<script src="' + baseURL + pi + '"></script>');
    }
    // 最后加载执行语言包脚本 lang/zh-cn/zh-cn.js
})();
