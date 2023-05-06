const spreadsheetId = "****各自のスプレッドシートIDに書き換え*****"
const 注文グループ = new Sheet({spreadsheetId:spreadsheetId,sheetName:'注文グループ'})
const 注文リスト = new Sheet({spreadsheetId:spreadsheetId,sheetName:"注文リスト"})
const products = new Sheet({spreadsheetId:spreadsheetId,sheetName:"Products"})
const users = new Sheet({spreadsheetId:spreadsheetId,sheetName:'Users'})

const getUser=()=>users.docs[Session.getActiveUser().getEmail()]
const getProducts=()=>JSON.stringify(products.items)

const getAll注文グループ=()=>{
  const items = 注文グループ.items.map(item=>{
    return {...item,注文者名:users.docs[item.注文者メールアドレス].名前}
  })
  return JSON.stringify(items)  
}

const get注文グループ=(注文グループID)=>{
  const 注文 = 注文グループ.docs[注文グループID]
  注文.注文者名 = users.docs[注文.注文者メールアドレス].名前

  const その注文の注文リスト = 注文リスト.items
    .filter(item=>item.注文グループID===注文グループID)
    .map(item=>{
      const 商品情報 = products.docs[item.通販コード]
      return {...item,...商品情報}
    })  
  return JSON.stringify([注文,その注文の注文リスト])
}

const save注文グループ=(json)=>{
  const {注文:order,注文リスト:list} = JSON.parse(json)
  if(Object.values(order).some(val=>val===''))throw('注文に空白欄があります')
  list.forEach(注文品=>{
    if(Object.values(注文品).some(val=>val===''))throw('注文品に空白欄があります')
  })

  order.期日 = new Date(order.期日)
  // 期日は一週間後より後を指定
  if(order.期日.getTime()<(new Date()).getTime()+7*24*60*60*1000)throw('期日は一週間より後を指定してください')
  注文グループ.setItem(order)

  list.forEach(注文品=>{
    注文リスト.setItem(注文品)
  })
  return 'OK'
}

const delete注文グループ=(id)=>{
  注文グループ.remove(id)

  const new注文リストitems = 注文リスト.items.filter(item=>item.注文グループID!==id)
  注文リスト.renew(new注文リストitems)
  return 'OK'
}

const test=()=>{
  const res = getProducts()
  console.log(res)
}
