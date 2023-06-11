import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {StylesManager, Survey, SurveyNG} from 'survey-angular';
import {Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-survey-view',
  template: `
    <div #surveyContainer></div>`,
  styleUrls: ['./survey.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SurveyComponent implements OnDestroy, AfterViewInit {

  @ViewChild('surveyContainer', {static: true}) surveyContainerElement?: ElementRef<HTMLDivElement>;
  private destroyed$ = new Subject<void>();

  constructor(private readonly route: ActivatedRoute) {
  }

  private static applyStyle(survey: Survey): void {
    // Apply the "bootstrap" theme and custom styles
    survey.css = {
      root: 'sv_main sv_bootstrap_css',
      container: 'sv_container container-fluid p-0',
      header: 'panel-heading card-header px-0',
      body: 'sv_body panel-body card-block',
      bodyEmpty: 'sv_body panel-body card-block container',
      footer: 'panel-footer card-footer justify-content-end px-3 py-2',
      title: '',
      description: '',
      logo: 'sv_logo',
      logoImage: 'sv_logo__image',
      headerText: 'container px-3',
      navigationButton: 'btn btn-primary ms-2',
      completedPage: 'container mt-3',
      navigation: {
        complete: 'btn sv_complete_btn',
        prev: 'btn sv_prev_btn',
        next: 'btn sv_next_btn',
        start: 'btn sv_start_btn',
        preview: 'btn sv_preview_btn',
        edit: 'btn sv_edit_btn',
      },
      progress: 'progress center-block mx-auto my-4 row overflow-visible',
      progressBar: 'progress-bar col-auto h-100',
      progressTextUnderBar: 'col-auto w-100 text-center',
      progressTextInBar: 'sv-hidden',
      progressButtonsContainerCenter: 'sv_progress-buttons__container-center',
      progressButtonsContainer: 'sv_progress-buttons__container',
      progressButtonsImageButtonLeft: 'sv_progress-buttons__image-button-left',
      progressButtonsImageButtonRight: 'sv_progress-buttons__image-button-right',
      progressButtonsImageButtonHidden: 'sv_progress-buttons__image-button--hidden',
      progressButtonsListContainer: 'sv_progress-buttons__list-container',
      progressButtonsList: 'sv_progress-buttons__list',
      progressButtonsListElementPassed: 'sv_progress-buttons__list-element--passed',
      progressButtonsListElementCurrent: 'sv_progress-buttons__list-element--current',
      progressButtonsListElementNonClickable: 'sv_progress-buttons__list-element--nonclickable',
      progressButtonsPageTitle: 'sv_progress-buttons__page-title',
      progressButtonsPageDescription: 'sv_progress-buttons__page-description',
      page: {
        root: 'sv_p_root container pt-3',
        title: '',
        description: 'small',
      },
      pageTitle: '',
      pageDescription: 'small',
      row: 'sv_row',
      question: {
        mainRoot: 'sv_q sv_qstn px-0 py-3 overflow-visible',
        flowRoot: 'sv_q_flow sv_qstn p-0 py-3',
        header: '',
        headerLeft: 'title-left',
        content: '',
        contentLeft: 'content-left',
        titleLeftRoot: 'sv_qstn_left p-0',
        title: '',
        titleExpandable: 'sv_q_title_expandable',
        titleExpanded: 'sv_q_title_expanded',
        titleCollapsed: 'sv_q_title_collapsed',
        number: 'sv_q_num',
        description: 'small form-text text-muted mb-2',
        descriptionUnderInput: 'smallform-text text-muted',
        requiredText: 'text-danger',
        comment: 'form-control',
        required: '',
        titleRequired: '',
        hasError: 'has-error',
        indent: 20,
        formGroup: 'form-group',
      },
      panel: {
        title: 'sv_p_title card-title',
        titleExpandable: 'sv_p_title_expandable',
        titleExpanded: 'sv_p_title_expanded',
        titleCollapsed: 'sv_p_title_collapsed',
        titleOnError: '',
        icon: 'sv_panel_icon',
        iconExpanded: 'sv_expanded',
        description: 'small sv_p_description small form-text text-muted small form-text text-muted small form-text text-muted',
        container: 'sv_p_container card card-body mt-2 mx-3 mb-4',
        footer: 'sv_p_footer',
        number: 'sv_q_num',
        requiredText: 'text-danger',
      },
      error: {
        root: 'alert alert-danger',
        icon: 'glyphicon glyphicon-exclamation-sign',
        item: '',
        locationTop: 'sv_qstn_error_top',
        locationBottom: 'sv_qstn_error_bottom',
      },
      boolean: {
        root: 'form-switch ps-0',
        rootRadio: 'sv_qcbc sv_qbln',
        item: 'form-check-label d-inline-flex flex-nowrap sv-boolean__order-fix',
        control: 'form-check-input mx-0 px-2',
        itemChecked: '',
        itemIndeterminate: '',
        itemDisabled: '',
        switch: 'd-none',
        slider: '',
        label: 'px-2',
        disabledLabel: 'text-muted',
        materialDecorator: 'sv-item__decorator sv-boolean__decorator ',
        itemDecorator: '',
        checkedPath: '',
        uncheckedPath: '',
        indeterminatePath: '',
      },
      checkbox: {
        root: 'btn-group-vertical d-flex gap-2',
        item: '',
        itemChecked: '',
        itemSelectAll: 'sv_q_checkbox_selectall',
        itemNone: 'sv_q_checkbox_none',
        itemInline: '',
        itemControl: 'form-check-input align-middle fs-5 mt-0',
        itemDecorator: '',
        label: 'btn btn-outline-light border-2 w-100 text-start p-2',
        labelChecked: 'active',
        controlLabel: 'align-middle',
        materialDecorator: 'd-none',
        other: 'sv_q_checkbox_other form-control',
        column: '',
      },
      ranking: {
        root: 'sv-ranking',
        rootMobileMod: 'sv-ranking--mobile',
        rootDragMod: 'sv-ranking--drag',
        rootDisabled: 'sv-ranking--disabled',
        item: 'sv-ranking-item',
        itemContent: 'sv-ranking-item__content',
        itemIndex: 'sv-ranking-item__index',
        // itemText: 'sv-ranking-item__text',
        controlLabel: 'sv-ranking-item__text',
        itemGhostNode: 'sv-ranking-item__ghost',
        itemIconContainer: 'sv-ranking-item__icon-container',
        itemIcon: 'sv-ranking-item__icon',
        itemIconHoverMod: 'sv-ranking-item__icon--hover',
        itemIconFocusMod: 'sv-ranking-item__icon--focus',
        itemGhostMod: 'sv-ranking-item--ghost',
        itemDragMod: 'sv-ranking-item--drag',
      },
      comment: 'form-control',
      dropdown: {
        root: '',
        control: 'form-control',
        selectWrapper: 'sv_select_wrapper',
        other: 'sv_q_dd_other form-control'
      },
      html: {
        root: ''
      },
      image: {
        root: 'sv_q_image',
        image: 'sv_image_image'
      },
      matrix: {
        root: 'table sv_q_matrix table-striped table-hover table-striped table-hover table-striped table-hover',
        label: 'w-100 text-center d-inline d-md-block',
        itemChecked: 'checked',
        itemDecorator: 'sv-hidden',
        cell: 'sv_q_m_cell',
        cellText: 'sv_q_m_cell_text',
        cellTextSelected: 'sv_q_m_cell_selected bg-primary',
        cellLabel: 'sv_q_m_cell_label',
        headerCell: 'text-center text-center text-center',
        itemValue: 'form-check-input align-middle fs-5 mt-0'
      },
      matrixdropdown: {
        root: 'table',
        cell: 'sv_matrix_cell',
        headerCell: 'sv_matrix_cell_header',
        row: 'sv_matrix_row',
        rowAdditional: 'sv-matrix__row--additional',
        detailRow: 'sv_matrix_detail_row',
        detailRowText: 'sv_matrix_cell_detail_rowtext',
        detailCell: 'sv_matrix_cell_detail',
        choiceCell: 'sv-table__cell--choice',
        detailButton: 'sv_matrix_cell_detail_button',
        detailButtonExpanded: 'sv_matrix_cell_detail_button_expanded',
        detailIcon: 'sv_detail_panel_icon',
        detailIconExpanded: 'sv_detail_expanded',
        detailPanelCell: 'sv_matrix_cell_detail_panel',
        actionsCell: 'sv_matrix_cell sv_matrix_cell_actions'
      },
      matrixdynamic: {
        root: 'table align-middle',
        button: 'btn btn-primary',
        buttonAdd: 'btn btn-success',
        buttonRemove: 'btn btn-danger',
        iconAdd: '',
        iconRemove: '',
        iconDrag: 'sv-matrixdynamic__drag-icon',
        cell: 'sv_matrix_cell',
        headerCell: 'sv_matrix_cell_header',
        row: 'sv_matrix_row',
        detailRow: 'sv_matrix_detail_row',
        detailCell: 'sv_matrix_cell_detail',
        choiceCell: 'sv-table__cell--choice',
        detailButton: 'sv_matrix_cell_detail_button',
        detailButtonExpanded: 'sv_matrix_cell_detail_button_expanded',
        detailIcon: 'sv_detail_panel_icon',
        detailIconExpanded: 'sv_detail_expanded',
        detailPanelCell: 'sv_matrix_cell_detail_panel',
        actionsCell: 'sv_matrix_cell sv_matrix_cell_actions',
        emptyRowsSection: 'sv_matrix_empty_rows_section',
        emptyRowsText: 'sv_matrix_empty_rows_text',
        emptyRowsButton: '',
        ghostRow: 'sv-matrix-row--drag-drop-ghost-mod'
      },
      paneldynamic: {
        root: '',
        navigation: 'sv-paneldynamic__navigation',
        progressTop: 'sv-paneldynamic__progress sv-paneldynamic__progress--top',
        progressBottom: 'sv-paneldynamic__progress sv-paneldynamic__progress--bottom',
        title: 'sv-title sv-question__title',
        button: 'button',
        buttonAdd: 'button sv-paneldynamic__add-btn',
        buttonRemove: 'sv_p_remove_btn',
        buttonRemoveRight: 'button sv-paneldynamic__remove-btn--right',
        buttonPrev: 'sv-paneldynamic__prev-btn',
        buttonNext: 'sv-paneldynamic__next-btn',
        buttonPrevDisabled: 'sv-paneldynamic__prev-btn--disabled',
        buttonNextDisabled: 'sv-paneldynamic__next-btn--disabled',
        progressContainer: 'sv-paneldynamic__progress-container',
        progress: 'sv-progress',
        progressBar: 'sv-progress__bar',
        progressText: 'sv-paneldynamic__progress-text',
        panelWrapper: 'sv_p_wrapper',
        panelWrapperInRow: 'sv_p_wrapper_in_row',
        footer: '',
        progressBtnIcon: 'icon-progressbutton',
      },
      multipletext: {
        root: 'sv_q_mt table',
        itemTitle: 'sv_q_mt_title',
        item: 'sv_q_mt_item',
        itemLabel: 'sv_q_mt_label',
        row: 'form-group bmd-form-group',
        itemValue: 'sv_q_mt_item_value form-control',
      },
      radiogroup: {
        root: 'btn-group-vertical d-flex gap-2',
        item: '',
        itemChecked: 'customRadio--checked',
        itemInline: '',
        itemDecorator: '',
        label: 'btn btn-outline-light border-2 w-100 text-start p-2',
        labelChecked: 'active',
        itemControl: 'form-check-input border-2 align-middle fs-5 mt-0',
        controlLabel: 'align-middle',
        other: 'sv_q_radiogroup_other form-control',
        clearButton: 'sv_q_radiogroup_clear button',
        column: '',
        materialDecorator: 'd-none'
      },
      buttongroup: {
        root: 'sv-button-group',
        item: 'sv-button-group__item',
        itemIcon: 'sv-button-group__item-icon',
        itemDecorator: 'sv-button-group__item-decorator',
        itemCaption: 'sv-button-group__item-caption',
        itemHover: 'sv-button-group__item--hover',
        itemSelected: 'sv-button-group__item--selected',
        itemDisabled: 'sv-button-group__item--disabled',
        itemControl: 'sv-visuallyhidden'
      },
      imagepicker: {
        root: 'sv_imgsel',
        item: 'sv-imagecheckbox',
        itemChecked: 'sv-imagecheckbox_checked',
        label: 'sv_q_imgsel_label',
        itemControl: 'sv_q_imgsel_control_item',
        image: 'sv_q_imgsel_image',
        itemInline: '',
        itemText: 'sv-imagecheckbox_text',
        clearButton: 'sv_q_radiogroup_clear',
        itemHover: 'sv-imagecheckbox_hover'
      },
      rating: {
        root: 'btn-group',
        item: 'btn btn-outline-secondary',
        selected: 'active',
        minText: 'sv_q_rating_min_text',
        itemText: 'sv_q_rating_item_text',
        maxText: 'sv_q_rating_max_text',
        disabled: ''
      },
      text: 'form-control w-100',
      expression: '',
      file: {
        root: 'sv_q_file',
        placeholderInput: 'sv_q_file_placeholder',
        preview: 'sv_q_file_preview',
        removeButton: 'sv_q_file_remove_button',
        fileInput: 'sv_q_file_input',
        removeFile: 'sv_q_file_remove',
        fileDecorator: 'sv-hidden',
        fileSign: 'sv_q_file_sign',
        chooseFile: 'sv_q_file_choose_button',
        noFileChosen: 'sv_q_file_placeholder',
        dragAreaPlaceholder: 'sv-hidden',
        fileList: '',
        removeFileSvg: 'sv-hidden',
        fileSignBottom: 'sv-hidden',
        removeButtonBottom: 'sv-hidden'
      },
      signaturepad: {
        root: 'sv_q_signaturepad sjs_sp_container',
        controls: 'sjs_sp_controls',
        placeholder: 'sjs_sp_placeholder',
        clearButton: 'sjs_sp_clear',
      },
      saveData: {
        root: '',
        saving: 'alert alert-info',
        error: 'alert alert-danger',
        success: 'alert alert-success',
        saveAgainButton: '',
      },
      window: {
        root: 'modal-content',
        body: 'modal-body',
        header: {
          root: 'modal-header panel-title',
          title: 'pull-left',
          button: 'glyphicon pull-right',
          buttonExpanded: 'glyphicon pull-right glyphicon-chevron-up',
          buttonCollapsed: 'glyphicon pull-right glyphicon-chevron-down',
        },
      },
    };
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngAfterViewInit(): void {
    this.route.data
      .pipe(
        takeUntil(this.destroyed$),
        map(data => data?.survey as Survey)
      )
      .subscribe(survey => {
        // Set bootstrap theme and adjust color
        const defaultThemeColors = StylesManager.ThemeColors.bootstrap;
        defaultThemeColors['$main-color'] = 'var(--bs-primary)';
        StylesManager.applyTheme('bootstrap');
        // Apply style customizations
        SurveyComponent.applyStyle(survey);
        // Render Survey in ContainerElement
        if (this.surveyContainerElement != null) {
          SurveyNG.render(this.surveyContainerElement.nativeElement, {model: survey});
        }
      });
  }

  
}
