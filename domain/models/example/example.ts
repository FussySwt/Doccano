export class ExampleItemList {
  constructor(
    private _count: number,
    private _next: string | null,
    private _prev: string | null,
    private _items: ExampleItem[]
  ) {}

  static valueOf(
    { count, next, previous, results }:
    {
      count   : number,
      next    : string | null,
      previous: string | null,
      results : Array<any>
  }
  ): ExampleItemList {
    const items = results.map(item => ExampleItem.valueOf(item))
    return new ExampleItemList(
      count,
      next,
      previous,
      items
    )
  }

  get count() {
    return this._count
  }

  get next() {
    return this._next
  }

  get prev() {
    return this._prev
  }

  get items(): ExampleItem[] {
    return this._items
  }
}

export class ExampleItem {
  constructor(
    public id: number,
    public text: string,
    public meta: object,
    public annotationApprover: boolean | null,
    public corpus_example_content: Object,
    public corpus_info_content: String,
    public commentCount: number,
    public createdAt: string,
    public fileUrl: string,
    public isConfirmed: boolean,
    public state: number,
    public type: any,
    public parts: any,
    public title: string,
    public abstract: string,
    public tags: any
    // public tags: Array<string>
  ) {}

  static valueOf(
    { id, text, meta, annotation_approver, corpus_example_content, corpus_info_content, comment_count, created_at, filename, is_confirmed, state, type, parts, title, abstract, tags }:
    {
      id: number,
      text: string,
      meta: object,
      annotation_approver: boolean | null,
      corpus_example_content: Object,
      corpus_info_content: String,
      comment_count: number,
      created_at: string,
      filename: string,
      is_confirmed: boolean,
      state: number,
      type: any,
      parts: any,
      title: string,
      abstract: string,
      tags: any,
      // tags: Array<string>,
  }
  ): ExampleItem {
    return new ExampleItem(id, text, meta, annotation_approver, corpus_example_content, corpus_info_content, comment_count, created_at, filename, is_confirmed, state, type, parts, title, abstract, tags)
  }

  get url() {
    const l = this.fileUrl.indexOf('media/')
    const r = this.fileUrl.indexOf('media/', l + 1)
    return this.fileUrl.slice(0, l) + this.fileUrl.slice(r)
  }

  get filename() {
    const items = this.fileUrl.split('/')
    return items[items.length - 1]
  }

  toObject(): Object {
    return {
      id: this.id,
      text: this.text,
      meta: this.meta,
      annotation_approver: this.annotationApprover,
      comment_count: this.commentCount,
      created_at: this.createdAt,
      state: this.state,
      type: this.type,
      parts: this.parts
    }
  }
}
