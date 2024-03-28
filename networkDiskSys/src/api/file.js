import request from "@/utils/request";

export default {
  getFileList(searchModel) {
    return request({
      url: "/file/list",
      method: "get",
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        fileName: searchModel.fileName,
        type: searchModel.type
      },
    });
  },
  postChunks(formData) {
    return request({
      url: '/single3',
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: formData
    })
  },
  addRole(role) {
    return request({
      url: "/role",
      method: "post",
      data: role,
    });
  },
  merge(hash) {
    return request({
      url: '/merge',
      method: 'get',
      params: { hash: hash }
    })

  },
  getRoleById(id) {
    return request({
      // url:'/role/'+id,
      url: `/role/${id}`,
      method: "get",
    });
  },
  updateFile(file) {
    return request({
      url: "/file",
      method: "put",
      data: file,
    });
  },
  saveRole(role) {
    if (role.roleId == null && role.roleId == undefined) {
      return this.addRole(role);
    }
    return this.updateRole(role);
  },
  deleteFileByID(id) {
    return request({
      url: `/file/${id}`,
      method: "delete",
    });
  },
  getAllRoleList() {
    return request({
      url: "/role/all",
      method: "get",
    });
  },
};
