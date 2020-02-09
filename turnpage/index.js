(function(){
    function TurnPage(options,wrap){
        this.nowPage = options.nowPage || 1;
        this.allPage = options.allPage || 1;
        this.wrap = wrap || $('body');
        this.changePage = options.changePage || function (){}
        this.init = function (){
            this.fillHtml();
            this.bindEvent();
        }
    }
    TurnPage.prototype.fillHtml = function (){
        var pageUl = $('<ul class="turn-page"></ul>');
        // 添加上一页
        if(this.nowPage > 1){
            $('<li class="prev-page">上一页</li>').appendTo(pageUl);
        }
        // 添加第一页
        $('<li class="num">1</li>').appendTo(pageUl).addClass(this.nowPage === 1 ? "current-page" : "");
        // 添加省略号
        if(this.nowPage - 2 > 2){
            $('<span>...</span>').appendTo(pageUl);
        }
        // 添加中间的页码
        for(var i = this.nowPage - 2;i <= this.nowPage + 2;i++){
            if(i > 1 && i < this.allPage){
                $('<li class="num"></li>').text(i).appendTo(pageUl).addClass(this.nowPage === i ? "current-page" : "");;
            }
        }
        // 添加后面的省略号
        if(this.nowPage + 2 < this.allPage - 1){
            $('<span>...</span>').appendTo(pageUl);
        }
        // 添加最后一页
        this.allPage != 1 && $('<li class="num"></li>').text(this.allPage).appendTo(pageUl).addClass(this.nowPage === this.allPage ? "current-page" : "");;
        // 添加下一页
        if(this.nowPage < this.allPage){
            $('<li class="next-page">下一页</li>').appendTo(pageUl);
        }
        this.wrap.html(pageUl);
    }
    TurnPage.prototype.bindEvent = function (){
        var self = this;
        $('.prev-page').on('click',function(){
            self.nowPage --;
            self.init();
            self.changePage(self.nowPage);
        })
        $('.num').on('click',function(){
            self.nowPage = parseInt($(this).text());
            self.init();
            self.changePage(self.nowPage);
        })
        $('.next-page').on('click',function(){
            self.nowPage++;
            self.init();
            self.changePage(self.nowPage);
        })
    }
    $.fn.extend({
        turnpage: function (options){
            var turnpage = new TurnPage(options,this);
            turnpage.init();
        }   
    })
})()