import styles from '../VisionBoardGrid/VisionGrid.module.scss';

export default function VisionGridComponent({
    gridItems,
    selectedItemIndex,
    selectedOption,
    uploadedText,
    handleGridItemClick,
    handleCheckboxClick,
    readOnly
}) {

    return (
        
        <div className={styles.gridContainer}>
            {gridItems.map((item, index) => {
                const isHidden =
                    selectedOption === '2' && [1, 3, 5, 7].includes(index);
                const gridItemClassName = `${styles.gridItem} ${isHidden ? styles.hidden : ''
                    }`;
                return (
                    <div
                        key={item.id}
                        className={
                            item.id === 'name'
                                ? styles.gridItemName
                                : `${gridItemClassName} ${styles.hoverable}`
                        }
                        onClick={() => handleGridItemClick(index)}
                    >
                        {item.id !== 'name' && (
                            <>
                                {item.img && (
                                    <img
                                        src={item.img}
                                        alt="Selected"
                                        style={{ maxWidth: '210px', maxHeight: '210px' }}
                                    />
                                )}
                                {item.text && (
                                    <div className={styles.gridItemText}>
                                        {item.text}
                                        {item.id === selectedItemIndex && uploadedText && (
                                            <div>{uploadedText}</div>
                                        )}
                                    </div>
                                )}
                                <input
                                    type="checkbox"
                                    checked={item.isChecked}
                                    onChange={() => handleCheckboxClick(index)}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{visibility : readOnly ? 'hidden': ''}}
                                />
                            </>
                        )}
                    </div>
                );
            })}
        </div>
        
    )
}


