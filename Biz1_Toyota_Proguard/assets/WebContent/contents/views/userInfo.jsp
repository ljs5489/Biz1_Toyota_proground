<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<!DOCTYPE html>
<html lang="ko">
<head>



<%@include file="../include/header.jsp"%>


</head>

<body>
	<div data-role="page" id="sub_wrap">
		<div data-role="content" id="sub_content">
			<ul class="my_info f_mt">
				<li class="info01 tab on" value="1">
					<!-- on off --> <span>�⺻����</span>
				</li>
				<li class="info02 tab off" value="2"><span>��й�ȣ����</span></li>
			</ul>
			<div class="info_wrap1" id="form1">
				<!-- �������� ���� -->
				<div class="info_div">
					<table width="100%" class="board_tb" id="userContent">
						<colgroup>
							<col width="40%">
							<col width="60%">
						</colgroup>
						<tbody class="tb_ok">
							<tr>
								<th scope="row" class="tb_rd">ID</th>
								<td id="userId"></td>
							</tr>
							<!--
				<tr>
				<th scope="row">Password</th>
				<td id="userPwd"></td>
				</tr>
				-->
							<tr>
								<th scope="row">����</th>
								<td id="userName"></td>
							</tr>
							<tr>
								<th scope="row">�������</th>
								<td id="userBirth"></td>
							</tr>
							<tr id="userEmailContent">
								<th scope="row">�̸����ּ�</th>
								<td id="userEmail"></td>
							</tr>
							<tr id="userEmailModifyContent" style="display: none;">
								<th scope="row">�̸����ּ�</th>
								<td><input type="email" name="" id="inp_email" style=""></td>
							</tr>
							<tr>
								<th scope="row" class="tb_rdl">�Ҽӵ�������</th>
								<td id="userDealer"></td>
							</tr>
						</tbody>
					</table>
				</div>
				<p class="clear ov_h" style="margin-top: 1em;">
					<a class="save_btn fl_r" id="btn_userModify">�� ��</a> <a
						class="save_btn fl_r" id="btn_userSave" style="display: none;">��
						��</a>
				</p>
			</div>

			<div class="info_wrap1" id="form2" style="display: none;">
				<!-- �������� ���� -->
				<!-- <form action="" method="" name=""> -->
				<div class="info_div">
					<div class="inner_con">
						<ul class="text_list">
							<li>������, ���� 8�ڸ� �̻��̾�� �մϴ�.</li>
							<li>������, Ư������ 8�ڸ� �̻��̾�� �մϴ�.</li>
							<li>��й�ȣ ��ȿ���ڴ� 90���Դϴ�.</li>
							<!-- <li>8(8)�� �̻� 15(15)�� �����̾�� �մϴ�.</li>
						<li>�ּ� �ϳ��� ������(a-z; A-Z)�� �����ؾ� �մϴ�.</li>
						<li>�ּ� �ϳ��� ����(0-9)�� �����ؾ� �մϴ�.</li>
						<li>�ּ� �ϳ��� Ư�� ���ڸ� �����ؾ� �մϴ�. </li>
						<li>���� ��� ������ �����ϴ�. @&%��.</li> -->
						</ul>
					</div>
					<table width="100%" class="board_tb mt_18 mb_30" id="pwdContent">
						<colgroup>
							<col width="40%">
							<col width="60%">
						</colgroup>
						<tbody class="tb_ok">
							<tr class="bg_g">
								<th scope="row" class="tb_rd">�űԺ�й�ȣ</th>
								<td class="tb_rd"><input type="password" name=""
									id="inp_newPwd1"></td>
							</tr>
							<tr class="bg_g">
								<th scope="row" class="tb_rdl">��й�ȣȮ��</th>
								<td class="tb_rdl"><input type="password" name=""
									id="inp_newPwd2"></td>
							</tr>
						</tbody>
					</table>
				</div>
				<p class="clear ov_h" style="margin-top: 1em;">
					<a class="save_btn fl_r" id="btn_pwdModify">�� ��</a>
				</p>
				<!-- </form> -->
			</div>
		</div>
		<!-- /content -->

	</div>
	<!-- /page -->

</body>
</html>
tml>
