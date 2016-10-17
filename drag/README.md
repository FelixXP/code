#原生JavaScript实现元素拖动

- drag函数：传入元素id
- onmousedown：记录鼠标相对元素left和top的距离
- onmousemove：计算鼠标移动距离，设置元素left/top
- onmouseup：删除onmousemove函数