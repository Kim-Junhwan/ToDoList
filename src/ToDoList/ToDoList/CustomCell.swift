//
//  CustomCell.swift
//  getToDoList
//
//  Created by JunHwan Kim on 2021/11/18.
//

import Foundation
import UIKit
import SnapKit

class CustomCell : UITableViewCell {
    static let identifier: String = "cellIdentifier"
    
    var contentLabel : UILabel = {
        let label = UILabel()
        label.font = UIFont.boldSystemFont(ofSize: 15)
        return label
    }()
    
    override init(style : UITableViewCell.CellStyle, reuseIdentifier : String?){
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        self.configure()
    }
    required init?(coder : NSCoder){
        fatalError("init(coder: ) has not been implemented")
    }
    
    func configure(){
        self.contentView.addSubview(contentLabel)
        contentLabel.snp.makeConstraints { make in
            make.leading.equalToSuperview().offset(30)
            make.trailing.equalToSuperview().offset(-10)
            make.top.equalToSuperview().offset(10)
            make.bottom.equalToSuperview().offset(-20)
        }
    }
    
}
