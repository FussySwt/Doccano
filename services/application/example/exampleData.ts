import { ExampleItem, ExampleItemList } from '~/domain/models/example/example'


export class ExampleDTO {
  id: number;
  text: string;
  meta: object;
  annotationApprover: any;
  corpus_example_content: any;
  corpus_info_content: String;
  commentCount: number;
  createdAt: string;
  isApproved: boolean;
  fileUrl: string;
  filename: string;
  url: string;
  isConfirmed: boolean;
  state: number;
  type: string;
  title: string;
  abstract: string;
  parts?: any;
  tags: Array<string>;

  constructor(item: ExampleItem) {
    this.id = item.id
    this.text = item.text
    this.meta = item.meta
    this.annotationApprover = item.annotationApprover
    this.corpus_example_content = item.corpus_example_content
    this.corpus_info_content = item.corpus_info_content
    this.commentCount = item.commentCount
    this.createdAt = item.createdAt
    this.isApproved = !!item.annotationApprover
    this.fileUrl = item.fileUrl
    this.filename = item.filename
    this.url = item.url
    this.isConfirmed = item.isConfirmed
    this.state = item.state
    this.type = item.type
    this.parts = item.parts
    this.title = item.title
    this.abstract = item.abstract
    this.tags = item.tags
  }
}

export class ExampleListDTO {
  count: number
  next : string | null
  prev : string | null
  items: ExampleDTO[]

  constructor(item: ExampleItemList) {
    this.count = item.count
    this.next = item.next
    this.prev = item.prev
    this.items = item.items.map(_ => new ExampleDTO(_))
  }
}
