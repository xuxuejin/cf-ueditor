/**
 * @description
 * 简单上传:点击按钮,直接选择文件上传
 * @author Jinqn
 * @date 2014-03-31
 */
UE.plugin.register("simpleupload", function () {
    var me = this,
        isLoaded = false,
        containerBtn;

    function initUploadBtn() {
        var input = document.createElement("input");
        input.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;cursor:pointer;font-size:0;opacity:0;';
        input.type = 'file';
        input.accept = me.getOpt('imageAllowFiles').join(',');
        containerBtn.appendChild(input);
        domUtils.on(input, 'click', function (e) {
            var toolbarCallback = me.getOpt("toolbarCallback");
            if (toolbarCallback) {
                if (true === toolbarCallback('simpleupload', me)) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        });
        domUtils.on(input, 'change', function (e) {
            var state = me.queryCommandState("simpleupload");
            if (state === -1) {
                return;
            }
            if (!input.value) {
                return;
            }

            var loadingId = UE.dialog.loadingPlaceholder(me);
            // 不需要走配置
            // if (!me.getOpt("imageActionName")) {
            //     UE.dialog.removeLoadingPlaceholder(me, loadingId);
            //     UE.dialog.tipError(me, me.getLang("autoupload.errorLoadConfig"));
            //     return;
            // }

            var allowFiles = me.getOpt("imageAllowFiles");
            var filename = input.value, fileext = filename ? filename.substr(filename.lastIndexOf(".")) : "";
            if (
                !fileext ||
                (allowFiles &&
                    (allowFiles.join("") + ".").indexOf(fileext.toLowerCase() + ".") === -1)
            ) {
                UE.dialog.removeLoadingPlaceholder(me, loadingId);
                UE.dialog.tipError(me, me.getLang("autoupload.exceedTypeError"));
                return;
            }

            var upload = function (file) {
                const formData = new FormData();
                formData.append(me.getOpt('imageFieldName'), file, file.name);
                UE.api.requestAction(me, me.getOpt("imageActionName"), {
                    data: formData
                }).then(function (res) {
                    // var resData = me.getOpt('serverResponsePrepare')( res.data )
                    // if ('SUCCESS' === resData.state && resData.url) {
                    //     const loader = me.document.getElementById(loadingId);
                    //     domUtils.removeClasses(loader, "uep-loading");
                    //     const link = me.options.imageUrlPrefix + resData.url;
                    //     loader.setAttribute("src", link);
                    //     loader.setAttribute("_src", link);
                    //     loader.setAttribute("alt", resData.original || "");
                    //     loader.removeAttribute("id");
                    //     me.fireEvent("contentchange");
                    //     // 触发上传图片事件
                    //     me.fireEvent("uploadsuccess", {
                    //         res: resData,
                    //         type: 'image'
                    //     });
                    // } else {
                    //     UE.dialog.removeLoadingPlaceholder(me, loadingId);
                    //     UE.dialog.tipError(me, resData.state);
                    // }

                    if(res.status == 200) {
                        const {code, data, message} = res.data;
                        if(code == 0) {
                            const loader = me.document.getElementById(loadingId);
                            domUtils.removeClasses(loader, "uep-loading");
                            // const link = me.options.imageUrlPrefix + resData.url;
                            const link = data;
                            loader.setAttribute("src", link);
                            loader.setAttribute("_src", link);
                            // loader.setAttribute("alt", resData.original || "");
                            loader.removeAttribute("id");
                            me.fireEvent("contentchange");
                            // 触发上传图片事件
                            me.fireEvent("uploadsuccess", {
                                res: {url: link, original: ''},
                                type: 'image'
                            });
                        } else {
                            UE.dialog.removeLoadingPlaceholder(me, loadingId);
                            UE.dialog.tipError(me, message);
                        }
                    } else {
                        UE.dialog.removeLoadingPlaceholder(me, loadingId);
                        UE.dialog.tipError(me, res.statusText);
                    }
                }).catch(function (err) {
                    UE.dialog.removeLoadingPlaceholder(me, loadingId);
                    UE.dialog.tipError(me, err);
                });
            };
            var file = input.files[0];
            /**
             * xxj
             * imageCompressEnable: 是否压缩图片,默认 true
             * imageMaxSize: 上传大小限制,默认 5MB
             * imageCompressBorder: 设置图片的最大边界,默认 1600，如果上传的图片宽或高超过这个值，图片将被压缩到这个值以内
             * 举例：设置为 1600px，上传了一张 4000x3000px 的图片。此时图片将被压缩，使得长边为 1600px，短边按比例缩小。压缩后的图片尺寸大约为 1600x1200px。
             */
            var imageCompressEnable = me.getOpt('imageCompressEnable') || true,
                imageMaxSize = me.getOpt('imageMaxSize') || 10 * 1024 * 1024,
                imageCompressBorder = me.getOpt('imageCompressBorder') || 656;
            if (imageCompressEnable) {
                UE.image.compress(file, {
                    maxSizeMB: imageMaxSize / 1024 / 1024,
                    maxWidthOrHeight: imageCompressBorder
                }).then(function (compressedFile) {
                    if (me.options.debug) {
                        console.log('SimpleUpload.CompressImage', (compressedFile.size / file.size * 100).toFixed(2) + '%');
                    }
                    upload(compressedFile);
                }).catch(function (err) {
                    console.error('SimpleUpload.CompressImage.error', err);
                    upload(file);
                });
            } else {
                upload(file);
            }
        });

        var stateTimer;
        me.addListener("selectionchange", function () {
            clearTimeout(stateTimer);
            stateTimer = setTimeout(function () {
                var state = me.queryCommandState("simpleupload");
                if (state === -1) {
                    input.disabled = "disabled";
                } else {
                    input.disabled = false;
                }
            }, 400);
        });
        isLoaded = true;
    }

    return {
        bindEvents: {
            ready: function () {
                //设置loading的样式
                utils.cssRule(
                    "loading",
                    ".uep-loading{display:inline-block;cursor:default;background: url('" +
                    this.options.themePath +
                    this.options.theme +
                    "/images/loading.gif') no-repeat center center transparent;border-radius:3px;outline:1px solid #EEE;margin-right:1px;height:22px;width:22px;}\n" +
                    ".uep-loading-error{display:inline-block;cursor:default;background: url('" +
                    this.options.themePath +
                    this.options.theme +
                    "/images/loaderror.png') no-repeat center center transparent;border-radius:3px;outline:1px solid #EEE;margin-right:1px;height:22px;width:22px;" +
                    "}",
                    this.document
                );
            },
            /* 初始化简单上传按钮 */
            simpleuploadbtnready: function (type, container) {
                containerBtn = container;
                me.afterConfigReady(initUploadBtn);
            }
        },
        outputRule: function (root) {
            utils.each(root.getNodesByTagName("img"), function (n) {
                if (/\b(uep\-loading\-error)|(bloaderrorclass)\b/.test(n.getAttr("class"))) {
                    n.parentNode.removeChild(n);
                }
            });
        },
        commands: {
            simpleupload: {
                queryCommandState: function () {
                    return isLoaded ? 0 : -1;
                }
            }
        }
    };
});
