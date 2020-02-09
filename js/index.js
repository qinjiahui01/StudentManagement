var menuList = document.getElementsByClassName("menu-list")[0];
var studentAddBtn = document.getElementById("student-add-btn");
var tbody = document.getElementById("tbody");
var studentlistMenu = menuList.getElementsByTagName("dd")[0];
var form = document.getElementById("student-add-form");
var editForm = document.getElementById("student-edit-form");
var modal = document.getElementsByClassName("modal")[0];
var mask = document.getElementsByClassName("mask")[0];
var studentEditBtn = document.getElementById("student-edit-btn");
var changePageBtn = document.getElementsByClassName("change-page")[0];
// 表格数据
var tableData = [];
var curPage = 1;
var totalPage = 0;
bindEvent();
getTableData();
validateFormData(form);
validateFormData(editForm);

// 事件绑定
function bindEvent() {
  menuList.onclick = function(e) {
    if (e.target.tagName == "DD") {
      var activeList = menuList.getElementsByClassName("active");
      initStyle(activeList, "active", e.target);
      var id = e.target.dataset.id;
      var content = document.getElementById(id);
      var activeContentList = document.getElementsByClassName("content-active");
      initStyle(activeContentList, "content-active", content);
    }
  };
  studentAddBtn.onclick = function(e) {
    e.preventDefault();
    var data = getFormData(form);
    console.log(data);
    if (typeof data === "object") {
      transferData(
        "/api/student/addStudent",
        {
          sNo: data.sNo,
          name: data.name,
          sex: data.sex,
          birth: data.birth,
          phone: data.phone,
          address: data.address,
          email: data.email
        },
        function(data) {
          alert("添加成功");
          getTableData();
          form.reset();
          studentlistMenu.click();
        }
      );
    } else {
      alert(data);
    }
  };

  tbody.onclick = function(e) {
    if (e.target.tagName == "BUTTON") {
      var classList = e.target.classList,
        index = e.target.dataset.index;
      if (classList.contains("edit")) {
        modal.style.display = "block";
        var data = tableData[index];
        renderEditForm(data);
      } else if (classList.contains("delete")) {
        var isDelete = window.confirm("确定删除?");
        if (isDelete) {
          transferData(
            "/api/student/delBySno",
            { sNo: tableData[index].sNo },
            function(data) {
              alert("删除成功");
              getTableData();
            }
          );
        }
      }
    }
  };

  mask.onclick = function() {
    modal.style.display = "none";
  };
  studentEditBtn.onclick = function(e) {
    e.preventDefault();
    var editForm = document.getElementById("student-edit-form");
    var data = getFormData(editForm);
    if (typeof data == "string") {
      alert(data);
    } else {
      transferData("/api/student/updateStudent", data, function() {
        alert("修改成功");
        modal.style.display = "none";
        getTableData();
      });
    }
  };
  changePageBtn.onclick = function(e) {
    if (e.target.tagName === "BUTTON") {
      var classList = e.target.classList;
      if (classList.contains("next-btn")) {
        changePage("next");
      } else if (classList.contains("prev-btn")) {
        changePage("prev");
      }
      setChangePageBtnStatus();
    }
  };
}

function changePage(type) {
  if (type === "prev" && curPage > 1) {
    curPage--;
  } else if (type === "next" && curPage < totalPage) {
    curPage++;
  }
  getTableData();
}
function setChangePageBtnStatus() {
  var btns = changePageBtn.querySelectorAll(".btn");
  btns.forEach(function(element) {
    element.disabled = false;
    if (curPage === totalPage) {
      btns[1].disabled = true;
    } else if (curPage === 1) {
      btns[0].disabled = true;
    }
  });
}

function validateFormData(form) {
  var oInps = form.querySelectorAll('input[type="text"]');
  var rules = [
    { rule: "",message:""},
    { rule: /^\w+@\w+(\.\w+){1,2}$/, message: "请输入正确的邮箱" },
    { rule: /^\d{4,16}$/,message: "学号必须为4-16位的数字组成"},
    { rule: /^\d{4}$/,message: "请输入正确的年份"},
    { rule: /^\d{11}$/,message: "请输入正确的手机号"},
    { rule: "",message:""}
  ];
  oInps.forEach(function (element,index){
    element.oninput = function (e){
      var val = element.value.trim();
      var ruleObj = rules[index];
      if(!val){
        element.nextElementSibling.innerText = "不能为空";
        element.nextElementSibling.style.visibility = "visible";
        
      }else if(ruleObj.rule instanceof RegExp){
        if(!ruleObj.rule.test(val)){
          element.nextElementSibling.innerText = ruleObj.message;
          element.nextElementSibling.style.visibility = "visible";
        }else{
          element.nextElementSibling.style.visibility = "hidden";
        }
      }else{
        element.nextElementSibling.style.visibility = "hidden";
      }
    }
  })
}
// 渲染编辑表单数据
function renderEditForm(data) {
  
  for (var prop in data) {
    if (editForm[prop]) {
      editForm[prop].value = data[prop];
    }
  }
}
// 渲染表格数据
function renderTable(data) {
  var str = "";
  data.forEach(function(item, index) {
    str += `
              <tr>
                  <td>${item.sNo}</td>
                  <td>${item.name}</td>
                  <td>${item.sex == 0 ? "男" : "女"}</td>
                  <td>${item.email}</td>
                  <td>${new Date().getFullYear() - item.birth}</td>
                  <td>${item.phone}</td>
                  <td>${item.address}</td>
                  <td>
                      <button class="btn edit" data-index="${index}">编辑</button>
                      <button class="btn delete" data-index="${index}">删除</button>
                  </td>
              </tr>`;
  });
  tbody.innerHTML = str;
}

/**
 * 添加类名
 */
function initStyle(domList, className, dom) {
  for (var i = 0; i < domList.length; i++) {
    domList[i].classList.remove(className);
  }
  dom.classList.add(className);
}

// 获取表单数据
function getFormData(form) {
  var name = form.name.value;
  var sex = form.sex.value;
  var email = form.email.value;
  var sNo = form.sNo.value;
  var birth = form.birth.value;
  var phone = form.phone.value;
  var address = form.address.value;

  if (!name || !sex || !email || !sNo || !birth || !phone || !address) {
    return "信息填写不全";
  }
  return {
    name,
    sex,
    email,
    sNo,
    birth,
    phone,
    address
  };
}

// 获取表格数据
function getTableData() {
  var size = 2;
  transferData("/api/student/findByPage", { page: curPage, size }, function(
    data
  ) {
    tableData = data.findByPage;
    totalPage = Math.ceil(data.cont / size);
    renderTable(tableData);
  });
}

function transferData(url, data, callback) {
  var responseText = saveData(
    "https://open.duyiedu.com" + url,
    Object.assign(
      {
        appkey: "1520352431_1569245706552"
      },
      data
    )
  );
  if (responseText.status == "success") {
    callback(responseText.data);
  } else {
    alert(responseText.msg);
  }
}
/**
 * 请求数据
 * @param {string}} url
 * @param {*} param
 */
function saveData(url, param) {
  var result = null;
  var xhr = null;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  if (typeof param == "string") {
    xhr.open("GET", url + "?" + param, false);
  } else if (typeof param == "object") {
    var str = "";
    for (var prop in param) {
      str += prop + "=" + param[prop] + "&";
    }
    xhr.open("GET", url + "?" + str, false);
  } else {
    xhr.open("GET", url + "?" + param.toString(), false);
  }
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        result = JSON.parse(xhr.responseText);
      }
    }
  };
  xhr.send();
  return result;
}
