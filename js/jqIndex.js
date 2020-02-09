var nowPage = 1;
var pageSize = 1;
var allPage = 1;
var tableData = []
var searchWord = "";
function bindEvent() {
    $('.menu-list').on('click', 'dd', function (e) {
        var id = $(this).data().id;
        $(this).addClass('active').siblings().removeClass('active');
        $('#' + id).fadeIn().siblings().fadeOut();
    })
    $('#student-add-btn').on('click', function (e) {
        e.preventDefault();
        var data = formData($('#student-add-form').serializeArray());
        if (data.status == "error") {
            alert(data.msg);
            return false;
        }
        transferData("/api/student/addStudent", data, function (res) {
            alert("添加成功");
            getTableData();
            $('#student-add-form')[0].reset();
            $(".menu-list > dd[data-id=student-list]").click();
        })
    })
    $('#tbody').on('click', '.btn', function () {
        var index = $(this).parents('tr').index();
        if ($(this).hasClass('edit')) {
            $('.modal').slideDown();
            renderEditForm(tableData[index]);
        }
        else if ($(this).hasClass('delete')) {
            var isDel = confirm('确认删除？');
            if (isDel) {
                transferData("/api/student/delBySno", { sNo: tableData[index].sNo }, function () {
                    alert('删除成功');
                    getTableData();
                })
            }
        }
    })
    $('.mask').on('click', function () {
        $('.modal').slideUp();
    })
    $('#student-edit-btn').on('click', function (e) {
        e.preventDefault();
        var data = formData($('#student-edit-form').serializeArray());
        console.log(data);
        transferData("/api/student/updateStudent", data, function () {
            alert('修改成功');
            $('.mask').click();
            getTableData();
        })
    })
    $('#search-btn').on('click', function () {
        var val = $('#search-inp').val();
        searchWord = val;
        nowPage = 1;
        if(val){
            console.log(val);
            searchData(val);
        }else{
            getTableData();
        }
    })
}
function searchData(val) {
    var sex = -1;
    if (val == '男') {
        sex = 0;
        val = '';
    } else if (val == '女') {
        sex = 1;
        val = '';
    }
    console.log(sex,val);
    transferData('/api/student/searchStudent', {
        sex: sex,
        search: val,
        page: nowPage,
        size: pageSize
    }, function (res) {
        allPage = Math.ceil(res.data.cont / pageSize);
        tableData = res.data.searchList;
        renderTable(tableData)
    })
}
function formData(arr) {
    var result = {};
    arr.forEach(function (ele, index) {
        result[ele.name] = ele.value;
        if (!ele.value) {
            result = {
                status: "error",
                msg: "数据填写不完全， 请检查后提交"
            };
        }
    })
    return result;
}
function getTableData() {
    transferData("/api/student/findByPage", {
        page: nowPage,
        size: pageSize
    }, function (res) {
        tableData = res.data.findByPage;
        allPage = Math.ceil(res.data.cont / pageSize);
        renderTable(tableData);
    })
}
// 数据交互
function transferData(url, data, callback) {
    $.ajax({
        url: "https://open.duyiedu.com" + url,
        type: "get",
        data: $.extend({ appkey: "1520352431_1569245706552" }, data),
        dataType: "json",
        success: function (res) {
            if (res.status === "success") {
                callback(res);
            } else {
                alert(res.msg);
            }
        }
    })
}
function renderTable(data) {
    var str = "";
    for (var i = 0; i < data.length; i++) {
        var student = data[i];
        str += ` <tr>
            <td>${student.sNo}</td>
            <td>${student.name}</td>
            <td>${student.sex == 0 ? '男' : '女'}</td>
            <td>${student.email}</td>
            <td>${new Date().getFullYear() - student.birth}</td>
            <td>${student.phone}</td>
            <td>${student.address}</td>
            <td>
                <button class="btn edit" data-index="${i}">编辑</button>
                <button class="btn delete" data-index="${i}">删除</button>
            </td>
        </tr>`;
    }
    $('#tbody').html(str);
    $('.change-page').turnpage({
        nowPage: nowPage,
        allPage: allPage,
        changePage: function (page) {
            nowPage = page;
            if (searchWord) {
                searchData(searchWord)
            } else {
                getTableData();
            }
        }
    })
}
// 渲染编辑表单
function renderEditForm(data) {
    var editForm = $('#student-edit-form')[0];
    for (var prop in data) {
        if (editForm[prop]) {
            editForm[prop].value = data[prop];
        }
    }
}

bindEvent();
getTableData();
