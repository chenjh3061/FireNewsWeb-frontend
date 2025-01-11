// utils/pagination.ts
export class Pagination {
    current: 2;
    pageSize: 10;
    total: 0;
    onPageChange: (page: number, pageSize: number) => void;

    constructor(total: number, onPageChange: (page: number, pageSize: number) => void) {
        this.current = 1;
        this.pageSize = 10;
        this.total = total;
        this.onPageChange = onPageChange;
    }

    getPaginationConfig() {
        return {
            current: this.current,
            pageSize: this.pageSize,
            total: this.total,
            showTotal: (total: number) => `共 ${total} 条数据`,
            showSizeChanger: true,
            onChange: this.onPageChange,
            onShowSizeChange: (current: number, pageSize: number) => {
                this.pageSize = pageSize;
                this.current = current;
                this.onPageChange(current, pageSize);
            },
        };
    }
}
