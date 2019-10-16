const getBuffer = pdfmake => new Promise(resolve => {
  pdfmake.getBuffer(data => resolve(data))
})

const getContentLength = () => {
  const search = window.location.search
  const contentLength = search.match(/contentLength=([\d]+)/)[1]
  return +contentLength
}

const getContent = () => {
  const contentLength = getContentLength()
  let contentArr = [{text: '谢谢你来过', style: 'h1'}]
  for (let i = 0; i < contentLength; i++) {
    contentArr.push({text: '徐志摩曾说过：“一生中至少该有一次，为了某个人而忘记了自己，不求结果，不求同行，不求曾经拥有，甚至不求你爱我，只求在我最美的年华里，遇见你。”我不知道自己是何等的幸运能在茫茫人海中与你相遇？我也不知道你的出现是恩赐还是劫？但总归要说声“谢谢你，谢谢你曾来过……”', style: 'p'})
    contentArr.push({text: '还记得初相识时你那拘谨的样子，话不是很多只是坐在那里听我不停地说着各种不着边际的话。可能因为紧张我也不知道自己想要表达什么？只知道乱七八糟的在说，而你只是静静地听着，偶尔插一两句。想想自己也不知道一个慢热甚至在不熟的人面前不苟言笑的我那天怎么会那么多话？后来才知道那就是你给的莫名的熟悉感和包容吧！', style: 'p'})
    contentArr.push({text: '有一句话说：“人的一生会遇到两个人，一个惊艳了时光，一个温柔了岁月。”', style: 'p'})
    contentArr.push({text: '惊艳了时光的那个人，是青春回忆里最绚烂、最耀眼的存在，不后悔跟他经历过的快乐与感动，哪怕后来的大风大浪都是他给的，但还是想对他说，有生之年，欣喜相逢。', style: 'p'})
    contentArr.push({text: '你给过我太多的快乐和感动，太多的收获和意外，也有太多的心酸和坎坷。可总归你来过我的生命，也带给我许多的美好和小幸福。我不知道是怎样的缘分让我们相遇，可我都不想去追究了，因为我相信每一种遇见，都有意义，每一个爱过的人，都有记忆。无论怎样，都是幸运的，因为你带给了我一些特殊的感受，以至于每次回味起来，都觉得人生是精彩的。', style: 'p'})
    contentArr.push({text: '我始终还记得那年夏天你为了在我路过的城市见我冒着大雨开车几百公里，只为在车站短短的停留……我也记得在街头只因我看了一眼那各式的冰糖葫芦，你穿越熙攘的人群排队为我拿回最后一个糖葫芦欣喜的样子，不是爱吃甜食的我那晚一口气吃掉了那个糖葫芦，而你看着我憋得满嘴和通红的脸只是宠溺的笑笑……我还记得因为我随口一说自己都没在意的东西而你却把它买回来了，就在有次离别的车站，当我不告而别你知道后发疯的电话、视频和在机场着急的身影，手里还提着我自己也不知道什么时候说过的东西时我就知道你就是那个惊艳了时光也温柔了我曾经岁月的人。', style: 'p'})
    contentArr.push({text: '“路漫漫其修远兮，吾将上下而求索”人生的路坎坎坷坷，舍与得在一念之间，我也曾满怀期待所有的相遇与分别是事出有因或者可以久别重逢。可怎奈，当再次面临抉择时才知道有的相遇只是漫漫人生路上的一个劫，一份缘的未尽而已……', style: 'p'})
    contentArr.push({text: '谢谢你来过，谢谢你给过我那么多，也谢谢你给我那些惊艳的时光！很知足过去有你陪伴的时光，很怀念那些和你一起走过的日子。未来我不知道该怎么取舍，我也不知道以后又会怎样？可无论是什么我都不会后悔认识你了，无论你带给我的是恩赐还是劫难我都不后悔了，至少我感受过你的温柔，拥有过你的怀抱，也和你十指相扣的走过了一段路。所以，以后无论怎样你都是我不经意间想起和思念的人。', style: 'p'})
    contentArr.push({text: '谢谢你来过！不管你是否真的快乐？不管岁月是否善待你我，也不管能否一直有你带给我的小确幸，还是谢谢你！谢谢你带给我的幸运，谢谢你曾为了我付出了全部的时间与爱，也谢谢你给我的岁月平淡和温情有于……', style: 'p'})
    contentArr.push({text: '没有太多的修饰，只是很庆幸曾经你也是我的“那个他”。谢谢你来过，谢谢你让我觉得我不会孤单，谢谢你用漫漫柔情，温暖了我的生命。你给的美好，我会悉数珍藏，用力保护的。', style: 'p'})
    contentArr.push({text: '以后也许三里清风，三里路，步步清风再无你。可也无悔你来过！人生的路你陪我一程，我念你一生………', style: 'p'})
    contentArr.push({text: '谢谢你来过！往后余生愿安好！感恩相遇，感恩来过……', style: 'p'})
  }
  return contentArr
}

const run = async () => {
  const content = getContent()
  const start = new Date()
  const opts = {
    pageSize: 'A4',
    pageMargins: [10, 100],
    header: [
      {text: '这是头部', style: 'header'}
    ],
    content,
    footer: [
      {text: '这是尾部', style: 'footer'}
    ],
    defaultStyle: {
      font: '方正姚体'
    },
    styles: {
      header: {
        fontSize: 16,
        lineHeight: 1.3,
        margin: [10, 16]
      },
      h1: {
        fontSize: 32,
        lineHeight: 1.3,
        margin: [0, 21],
        bold: true
      },
      p: {
        fontSize: 16,
        lineHeight: 1.3,
        margin: [0, 16]
      },
      footer: {
        fontSize: 16,
        lineHeight: 1.3,
        margin: [10, 16]
      }
    }
  }
  pdfMake.fonts = {
    '方正姚体': {
      normal: 'FZYTK.TTF',
      bold: 'FZYTK.TTF',
      italics: 'FZYTK.TTF',
      bolditalics: 'FZYTK.TTF'
    }
  }
  const pdfmake = pdfMake.createPdf(opts)
  const data = await getBuffer(pdfmake)
  const end = new Date()
  const time = end - start
  exportTime(time, data)
}

run()