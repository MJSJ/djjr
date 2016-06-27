'use strict'

var lessBinDebugOpts = {
        sourceMap: true,
        sourceMapRootpath: '../../'
    },
    debug = {env: 'debug'}

module.exports = function(grunt){
    grunt.initConfig({
        connect: {
          options: {
            port: 2000,
            hostname: '*', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
            livereload: 35729  //声明给 watch 监听的端口
          },

          server: {
            options: {
              open: true, //自动打开网页 http://
              base: [
                'public'  //主目录
              ]
            }
          }
        },


        clean: {
            options:{
                force: true
            },
            src: ['src'],
            dist: ['dist']
        },

        uglify:{
            options: {
                mangle: false, //不混淆变量名
                preserveComments: 'all', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                footer:'\n/*!  最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
            },
            dist:{
                files:[
                    {
                        expand:true,
                        cwd:"src/js/",
                        src:['*.js'],
                        dest:"dist/js/",
                        ext:'.min.js'
                    }
                ] 
            }    
        },
       
        less: {
            options:{
                // paths: 'src/less',
                relativeUrls: true
            },
            dist:{  
                files:[
                    {
                        expand:true,
                        cwd:"src/less/",
                        src:['*.less'],
                        dest:"build/css/",
                        ext:'.css'
                    }
                ] 

            }
        },

        autoprefixer : {
            options:{
                  browsers: ['last 8 versions', 'ie 8', 'ie 9'],
            },
            dist : {
                files : [
                    {   
                        expand:true,
                        cwd:"build/css/",
                        src:['*.css'],
                        dest:"dist/css/",
                        ext:'.css'
                    }
                ] 
            } 
        },

        htmlmin:{
            options: {
                cssmin: true,
                jsmin: true,
                removeComments: true,
                removeCommentsFromCDATA: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true
            },
            html: {
                files: [
                  {expand: true, cwd: 'src/', src: ['*.html'], dest: 'dist',ext:".html"}
               ]
            }
        },
        cssmin: {
          prod: {
             options: {
               report: 'gzip'
             },
             files: [{
                 expand: true,
                 cwd: 'dist/',
                 src: ['css/*.css'],
                 dest: 'dist',
                 ext:".min.css"
                }
             ]
          }
        },
       

        watch: {     
            less: {  
                files: ["src/less/*.less"],  
                tasks: ['less:dist'],  
                options: {  
                    debounceDelay: 250  
                }  
            },
            htmlmin:{
                files:"src/*.html",
                tasks:['htmlmin:html'],
                options: {  
                    debounceDelay: 250  
                } 
            },
            uglify:{
                files:["src/js/*.js"],
                tasks:["uglify"]
            },
            autoprefixer:{
                files:['build/css/*.css'],
                tasks:["autoprefixer:dist"],
                options: {  
                    debounceDelay: 250  
                } 
            },
            cssmin:{
                files:['dist/css/*.css'],
                tasks:["cssmin"],
                options: {  
                    debounceDelay: 250  
                }  
            },
            // livereload: {
            //     options: {
            //       livereload: '<%=connect.options.livereload%>'  //监听前面声明的端口  35729
            //     },

            //     files: [  //下面文件的改变就会实时刷新网页
            //       'app/*.html',
            //       'app/style/{,*/}*.css',
            //       'app/scripts/{,*/}*.js',
            //       'app/images/{,*/}*.{png,jpg}'
            //     ]
            // }  
        } 


    });

    grunt.loadNpmTasks('grunt-contrib-less')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-contrib-htmlmin')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-cssmin')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-autoprefixer')
    grunt.loadNpmTasks('grunt-contrib-connect')
    
    var task = function(){
        var name = this.name
            , tasks = ['clean', 'copy', 'less','uglify','autoprefixer']
            , targets = tasks.map(function(v, i, m){
                var target = name === 'debug' && v !== 'less' ? 'bin' : name
                return v + ':' + target
            })
        grunt.task.run(targets)
    }
    grunt.registerTask('bin', task)
    grunt.registerTask('debug', task)
    grunt.registerTask('dist', task)
    grunt.registerTask('min', ['uglify:dist']);
    grunt.registerTask('default',['less','autoprefixer','cssmin','htmlmin','uglify','watch','connect']);
}