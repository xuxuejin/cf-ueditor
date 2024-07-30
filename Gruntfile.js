"use strict";

module.exports = function (grunt) {
    var fs = require("fs"),
        Util = {
            jsBasePath: "_src/",
            parseBasePath: "_parse/",
            cssBasePath: "themes/default/_css/",
            // 读取指定文件，提取其中包含的 JavaScript 文件路径，并返回这些路径
            fetchScripts: function (readFile, basePath) {
                var sources = fs.readFileSync(readFile);
                sources = /\[([^\]]+\.js'[^\]]+)\]/.exec(sources);
                sources = sources[1]
                    .replace(/\/\/.*\n/g, "\n")
                    .replace(/'|"|\n|\t|\s/g, "");
                sources = sources.split(",").filter(o => o);
                sources.forEach(function (filepath, index) {
                    sources[index] = basePath + filepath;
                });
                return sources;
            },
            // 读取 ueditor.css 文件中的 @import 语句，提取其中包含的 CSS 文件路径，并返回这些路径
            fetchStyles: function () {
                var sources = fs.readFileSync(this.cssBasePath + "ueditor.css"),
                    filepath = null,
                    pattern = /@import\s+([^;]+)*;/g,
                    src = [];

                while ((filepath = pattern.exec(sources))) {
                    src.push(this.cssBasePath + filepath[1].replace(/'|"/g, ""));
                }

                return src;
            }
        },
        packageJson = grunt.file.readJSON("package.json"),
        distDir = "dist/",
        distMinDir = "dist-min/",
        banner = "/*! " + packageJson.title + " v" + packageJson.version + "*/\n";

    //init
    (function () {
        distDir = "dist/";
    })();

    var dateHash = (new Date()).getTime();

    grunt.initConfig({
        pkg: packageJson,
        concat: {
            js: {
                options: {
                    banner: "/*!\n * " +
                        packageJson.title +
                        "\n * version: " +
                        packageJson.version +
                        "\n*/\n(function(){\n\n",
                    footer: "\n\n})();\n",
                    process: function (src, s) {
                        var filename = s.substr(s.indexOf("/") + 1);
                        return (
                            "// " + filename + "\n" + src.replace("/_css/", "/css/") + "\n"
                        );
                    }
                },
                src: Util.fetchScripts("_examples/editor_api.js", Util.jsBasePath),
                dest: distDir + packageJson.name + ".all.js"
            },
            parse: {
                options: {
                    banner: "/*!\n * " +
                        packageJson.title +
                        " parse\n * version: " +
                        packageJson.version +
                        "\n*/\n(function(){\n\n",
                    footer: "\n\n})();\n"
                },
                src: Util.fetchScripts("ueditor.parse.js", Util.parseBasePath),
                dest: distDir + packageJson.name + ".parse.js"
            },
            css: {
                src: Util.fetchStyles(),
                dest: distDir + "themes/default/css/ueditor.css"
            }
        },
        cssmin: {
            options: {
                banner: banner
            },
            files: {
                cwd: distDir,
                src: [
                    '**/*.css',
                ],
                dest: distMinDir,
                expand: true
            }
        },
        uglify: {
            options: {
                banner: banner
            },
            files: {
                cwd: distDir,
                src: [
                    '**/*.js',
                    '!third-party/zeroclipboard/ZeroClipboard.js',
                    '!ueditor.all.js',
                ],
                dest: distMinDir,
                expand: true
            },
        },
        copy: {
            base: {
                files: [
                    {
                        src: [
                            "*.html",
                            "themes/iframe.css",
                            "themes/default/dialog.css",
                            "themes/default/dialogbase.css",
                            "themes/default/images/**",
                            "themes/default/exts/**",
                            // "themes/default/font/**",
                            "dialogs/**",
                            "lang/**",
                            "third-party/**",
                            "plugins/**",
                        ],
                        dest: distDir
                    }
                ]
            },
            dist: {
                files: [
                    {
                        cwd: distDir,
                        src: '**/*',
                        dest: distMinDir,
                        expand: true
                    }
                ]
            },
            demo: {
                files: [
                    {
                        src: "_examples/completeDemo.html",
                        dest: distDir + "index.html"
                    }
                ]
            },
        },
        transcoding: {
            options: {
                charset: 'utf-8'
            },
            src: [
                distDir + "**/*.html",
                distDir + "**/*.js",
                distDir + "**/*.css",
                distDir + "**/*.json",
            ]
        },
        replace: {
            demo: {
                src: distDir + "index.html",
                overwrite: true,
                replacements: [
                    {
                        from: /\.\.\//gi,
                        to: ""
                    },
                    {
                        from: "editor_api.js",
                        to: packageJson.name + ".all.js"
                    }
                ]
            },
        },
        clean: {
            build: {
                src: [
                    distDir + ".DS_Store",
                    distDir + "**/.DS_Store",
                    distDir + ".git",
                    distDir + "**/.git"
                ]
            }
        },
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "themes/default/_css/uibase.css": "themes/default/_css/uibase.less" // destination file and source file
                }
            }
        },
        base64: {
            options: {
                baseDir: 'themes/', // Base directory
                extensions: ['woff', 'ttf', 'woff2'], // File extensions to process
                maxImageSize: 8*1024, // Maximum size in bytes to embed files (8KB in this example)
                deleteAfterEncoding: false, // Do not delete files after encoding
            },
            files: {
                'themes/default/_css/uibase_2.css': 'themes/default/_css/uibase_2.css' // destination file and source file
            }
        }
    });

    grunt.loadNpmTasks("grunt-text-replace");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-transcoding");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-base64');

    grunt.registerTask("default", "UEditor build", function () {
        var tasks = [
            // 先转换 uibase.less 文件为 css
            'less',
            // 把转换后的 css 文件中的资源引用转换成 base64 
            'base64',
            "concat",
            "copy:base",
            "copy:demo",
            "replace:demo",
            "copy:dist",
            "uglify:files",
            "cssmin:files",
            "clean",
        ];

        tasks.push("transcoding");

        //config修改
        updateConfigFile();

        grunt.task.run(tasks);
    });

    function updateConfigFile() {
        var filename = "ueditor.config.js",
            file = grunt.file.read(filename);
        //写入到dist
        if (grunt.file.write(distDir + filename, file)) {
            grunt.log.writeln("config file update success");
        } else {
            grunt.log.warn("config file update error");
        }
    }
};
