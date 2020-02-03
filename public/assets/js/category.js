// 当添加分类表单发生提交行为的时候
$('#addCategory').on('submit', function() {
    // 获取用户在表单中输入的内容
    var formData = $(this).serialize();
    // 向服务器端发送请求 添加分类
    $.ajax({
            type: 'post',
            url: '/categories',
            data: formData,
            success: function() {
                location.reload();
            }
        })
        // 阻止表单默认提交行为
    return false;
});

// 发送ajax请求 向服务器端所有分类列表数据，我们不需要传递任何数据
$.ajax({
    type: 'get',
    url: '/categories',
    success: function(response) {
        // 将服务器端返回的数据和HTML模板进行拼接
        var html = template('categoryListTpl', { data: response });
        // 将拼接好的内容放到页面中
        $('#categoryBox').html(html);
    }
});

// 为编辑按钮添加点击事件,注意一下这里的 “事件委托”是很常用的方法
$('#categoryBox').on('click', '.edit', function() {
    // 获取要修改的分类数据的id
    var id = $(this).attr('data-id');
    // 根据id获取分类数据的详细信息
    $.ajax({
        type: 'get',
        url: '/categories/' + id,
        success: function(response) {
            console.log(response)
            var html = template('modifyCategoryTpl', response);
            $('#formBox').html(html);
        }
    })
});

// 当修改分类数据表单发生提交行为的时候
$('#formBox').on('submit', '#modifyCategory', function() {
    // 获取管理员在表单中输入的内容
    var formData = $(this).serialize();
    // 获取要修改的分类id
    var id = $(this).attr('data-id');
    // 发送请求 修改分类数据
    $.ajax({
            type: 'put',
            url: '/categories/' + id,
            data: formData,
            success: function() {
                location.reload();
            }
        })
        // 阻止表单的默认提交行为
    return false;
});

// 当删除按钮被点击的时候
$('#categoryBox').on('click', '.delete', function() {
    if (confirm('您真的要执行删除操作吗')) {
        // 获取要删除的分类数据id
        var id = $(this).attr('data-id');
        // 向服务器端发送请求 删除分类数据
        $.ajax({
            type: 'delete',
            url: '/categories/' + id,
            success: function() {
                location.reload();
            }
        })
    }
});
var selectAll = $('#selectAll');
var deleteMany = $('#deleteMany');
// 当全选按钮的状态发生改变时
selectAll.on('change', function() {
    // 获取到全选按钮当前的状态
    var status = $(this).prop('checked');

    if (status) {
        // 显示批量删除按钮
        deleteMany.show();
    } else {
        // 隐藏批量删除按钮
        deleteMany.hide();
    }

    // 获取到所有的用户并将用户的状态和全选按钮保持一致
    $('#categoryBox').find('input').prop('checked', status);
    // 当用户前面的复选框状态发生改变时
});

$('#categoryBox').on('change', '.categoriesStatus', function() {
    // 获取到所有用户 在所有用户中过滤出选中的用户
    // 判断选中用户的数量和所有用户的数量是否一致
    // 如果一致 就说明所有的用户都是选中的
    // 否则 就是有用户没有被选中
    var inputs = $('#categoryBox').find('input');

    if (inputs.length == inputs.filter(':checked').length) {
        // alert('所有用户都是选中的')
        selectAll.prop('checked', true)
    } else {
        // alert('不是所有用户都是选中的')
        selectAll.prop('checked', false)
    }

    // 如果选中的复选框的数量大于0 就说明有选中的复选框
    if (inputs.filter(':checked').length > 0) {
        // 显示批量删除按钮
        deleteMany.show();
    } else {
        // 隐藏批量删除按钮
        deleteMany.hide();
    }
});

// 为批量删除按钮添加点击事件
deleteMany.on('click', function() {
    var ids = [];
    // 获取选中的用户
    var checkedUser = $('#categoryBox').find('input').filter(':checked');
    // 循环复选框 从复选框元素的身上获取data-id属性的值
    checkedUser.each(function(index, element) {
        ids.push($(element).attr('data-id'));
    });

    if (confirm('您真要确定要进行批量删除操作吗')) {
        $.ajax({
            type: 'delete',
            url: '/categories/' + ids.join('-'),
            success: function() {
                location.reload();
            }
        })
    }
});