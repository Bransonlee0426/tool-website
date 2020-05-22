const popuptype = [{
  type: 'mail',
  imageurl: '"https://i.bmp.ovh/imgs/2019/07/76efb4655647be8e.png"',
  message: '重設密碼信件已寄到您的信箱！',
}];

function cusMsg(msg) {
  const message = [{
    type: 'addFailed',
    message: `第${msg}筆資料新增失敗`,
  }, {
    type: 'nullValue',
    message: `${msg}不能為空，請確實填寫`,
  }];
  return message;
}

const msg = [{
  type: 'successUpload',
  message: '檔案上傳成功!',
}, {
  type: 'failedUpload',
  message: '上傳檔案失敗!',
}, {
  type: 'uploadMaximum',
  message: '最大檔案數為1個，請先剛除原本的檔案!',
}, {
  type: 'getFail',
  message: '獲取資料失敗!請重新嘗試',
}, {
  type: 'successEdit',
  message: '編輯成功!',
}, {
  type: 'successDelete',
  message: '刪除成功!',
}, {
  type: 'failedDelete',
  message: '刪除失敗',
}, {
  type: 'existImage',
  message: '品牌圖片已存在',
}, {
  type: 'noUploadImage',
  message: '請先上傳圖片',
}, {
  type: 'noAddImage',
  message: '請先新增圖片',
}, {
  type: 'updateSuccess',
  message: '更新成功',
}, {
  type: 'addSuccess',
  message: '新增成功',
}, {
  type: 'updateFailed',
  message: '更新失敗',
}, {
  type: 'addFailed',
  message: '新增失敗',
}, {
  type: 'imageOversize',
  message: '圖片大小請控制在500KB以內',
}, {
  type: 'loginErr',
  message: '帳號密碼有誤',
}, {
  type: 'networkError',
  message: '網路錯誤',
}, {
  type: 'LabelLimited',
  message: 'Label 只能有一個',
}, {
  type: 'deleteStore',
  message: '此動作為刪除此餐廳內的所有菜餚，確定要刪除嗎？',
}, {
  type: 'confirmDelete',
  message: '確定刪除？',
}];

export default {
  popuptype,
  msg,
  cusMsg,
};
